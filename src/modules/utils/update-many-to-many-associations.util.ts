import { UpdateManyToManyAssociationsOptions } from '../interfaces/update-many-to-many-associations-options.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';

export async function updateManyToManyAssociations<
    T extends JoinTableEntity | CreatedByEntity<T>
>({
    parentInstanceId,
    joinTableModel,
    parentForeignKey,
    childForeignKey,
    newChildren,
    updatingUserId,
    transaction,
    childPrimaryKey = 'id',
    hasSortOrder,
    instanceSpecificJoinTableFields,
    additionalJoinTableCreateFields,
    childComparisonKeys,
    childCreateOrUpdateFields,
    joinTableFindAttributes
}: UpdateManyToManyAssociationsOptions<T>) {
    if (!childComparisonKeys) {
        childComparisonKeys = [childPrimaryKey];
    }
    // get the current join table objects
    const relationObjects = await joinTableModel.findAll({
        attributes: childCreateOrUpdateFields
            ? joinTableFindAttributes
            : undefined,
        where: { [parentForeignKey]: parentInstanceId }
    });
    // set of all the current relationObjects, will remove indexes that are in the newChildren,
    // then delete remaining and return at end
    const relationIndexesToDelete = new Set([
        ...Array(relationObjects.length).keys()
    ]);

    // additional fields that will be added to the association table
    if (!instanceSpecificJoinTableFields) {
        // set custom fields to empty array if not sent
        instanceSpecificJoinTableFields = [];
    }

    // promise array for all creates and deletes that will need to happen
    const promises = [];

    // loop through the newChildren to create relation if necessary
    for (let i = 0; i < newChildren.length; i += 1) {
        let relationObjectIndex: number = -1;
        relationObjects.find((object, index) => {
            let matches = true;
            childComparisonKeys.forEach(key => {
                if (object[key] !== newChildren[key]) {
                    matches = false;
                }
            });
            if (matches) {
                relationObjectIndex = index;
            }
            return matches;
        });

        // if they don't exist in the current relations, create new relation
        if (relationObjectIndex === -1) {
            // check for custom table fields
            const customFieldMatch = instanceSpecificJoinTableFields.find(
                instance => {
                    return instance.identity === newChildren[i].identity;
                }
            );

            let customTableFields = [];
            if (customFieldMatch && customFieldMatch.fields) {
                customTableFields = customFieldMatch.fields;
            }

            const createOrUpdateFields = {};

            if (childCreateOrUpdateFields) {
                childCreateOrUpdateFields.forEach(field => {
                    createOrUpdateFields[field] = newChildren[i][field];
                });
            }

            const newObject = {
                ...createOrUpdateFields,
                [childForeignKey as string]: newChildren[i][childPrimaryKey],
                [parentForeignKey as string]: parentInstanceId,
                // if sortOrder field doesn't exist, sequelize will not attempt to insert this value, so no error
                sortOrder: i,
                createdById: updatingUserId,
                updatedById: updatingUserId,
                ...additionalJoinTableCreateFields,
                ...customTableFields
            };

            promises.push(joinTableModel.create(newObject, { transaction }));
        }
        // if the newChild existed, then remove that index from the list to be deleted
        else {
            relationIndexesToDelete.delete(relationObjectIndex);

            // update sort order if necessary
            if (hasSortOrder) {
                const instance = relationObjects[relationObjectIndex];
                (instance as JoinTableEntity).sortOrder = i;
                (instance as CreatedByEntity<T>).updatedById = updatingUserId;
                if (childCreateOrUpdateFields) {
                    childCreateOrUpdateFields.forEach(field => {
                        instance[field] = newChildren[i][field];
                    });
                }
                promises.push(
                    relationObjects[relationObjectIndex].save({ transaction })
                );
            }
        }
    }

    // for all indexes of the current relations that were not in the new set, delete them
    const deletedRelationObjects: JoinTableEntity[] = [];
    for (const index of relationIndexesToDelete) {
        const instance = relationObjects[index] as CreatedByEntity<T>;
        instance.deletedById = updatingUserId;
        promises.push(relationObjects[index].destroy({ transaction }));
        deletedRelationObjects.push(instance);
    }

    // resolve all promises
    await Promise.all(promises);

    // return the join table models that were deleted
    return deletedRelationObjects;
}
