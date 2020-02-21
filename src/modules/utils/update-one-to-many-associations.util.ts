import { fn } from 'sequelize';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { UpdateOneToManyAssociationsOptions } from '../interfaces/update-one-to-many-associations-options.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { AttributesOf } from '../types/attributes-of.type';

export async function updateOneToManyAssociations<
    T extends CreatedByEntity<T>,
    AuthenticatedUserType extends AuthenticatedUser = AuthenticatedUser,
    NewChildrenType = any
>(
    {
        currentChildren,
        newChildren,
        comparisonFunction,
        fillFunction,
        user,
        transaction,
        childTableModel
    }: UpdateOneToManyAssociationsOptions<T, AuthenticatedUserType, NewChildrenType>
) {
    /*
     * Creates an set of all of the indexes that might be deleted.
     * For example, if 4 related objects were found the set is
     * [0, 1, 2, 3, 4].
     * As related objects are matched up with their children, the
     * index will be removed from the set to delete.
     */
    const relationIndexesToDelete = new Set([
        ...Array(currentChildren.length).keys()
    ]);

    // promise array for all creates and deletes that will need to happen
    const updatePromises: Promise<T>[] = [];

    const recordsToCreate: AttributesOf<T>[] = [];

    // loop through the newChildren to create relation if necessary
    for (let i = 0; i < newChildren.length; i += 1) {
        const relationObjectIndex = comparisonFunction(currentChildren, newChildren[i]);

        // if they don't exist in the current relations, create new relation
        if (relationObjectIndex < 0) {
            const filledRecord = fillFunction(user, newChildren[i], i);
            filledRecord.createdById = user.id;
            filledRecord.updatedById = user.id;
            recordsToCreate.push(filledRecord);
        }
        // if the newChild existed, then remove that index from the list to be deleted
        else {
            const relatedObject = currentChildren[relationObjectIndex];
            currentChildren.splice(relationObjectIndex, 1);
            relationIndexesToDelete.delete(relationObjectIndex);

            const filledRecord = fillFunction(user, newChildren[i], i, relatedObject);
            filledRecord.updatedById = user.id;
            // update sort order if necessary
            updatePromises.push(
                relatedObject.update(filledRecord, { transaction }) as unknown as Promise<T>
            );
        }
    }
    const createPromise: Promise<T[]> = childTableModel.bulkCreate(recordsToCreate, {
        returning: true,
        transaction
    }) as unknown as Promise<T[]>;

    // create an array of all the records to delete
    const deletedRelationObjects: T[] = [];
    const idsToDelete: number[] = [];
    relationIndexesToDelete.forEach(index => {
        idsToDelete.push(currentChildren[index].id);
        deletedRelationObjects.push(currentChildren[index]);
    });

    // create a default promise that will return that 0 records were updated
    let deletePromise = new Promise<[number, T[]]>(resolve => resolve([0, []]));
    // delete those records
    if (idsToDelete.length > 0) {
        deletePromise = childTableModel.update({
            deletedById: user.id,
            deletedAt: fn('now')
        }, {
            where: {
                id: idsToDelete
            },
            returning: true,
            transaction
        }) as unknown as Promise<[number, T[]]>;
    }

    // resolve all promises
    const [
        createdRecords,
        updatedRecords,
        [, deletedRecords]
    ] = await Promise.all([
        createPromise,
        Promise.all(updatePromises),
        deletePromise
    ]);

    // return the result of the update
    return {
        createdRecords,
        updatedRecords,
        deletedRecords
    };
}
