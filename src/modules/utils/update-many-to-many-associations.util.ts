import { fn } from 'sequelize';
import { UpdateManyToManyAssociationsOptions } from '../interfaces/update-many-to-many-associations-options.interface';
import { JoinTableEntity } from '../models/join-table.entity';

export async function updateManyToManyAssociations(
    {
        parentInstanceId,
        joinTableModel,
        parentForeignKey,
        childForeignKey,
        newChildren,
        updatingUserId,
        transaction,
        hasSortOrder,
        additionalJoinTableCreateFields
    }: UpdateManyToManyAssociationsOptions
) {

    // get the current join table objects
    const relationObjects = await joinTableModel.findAll({
        where: { [parentForeignKey]: parentInstanceId }
    });
    // map the objects to be an array of the child ids
    const relationIds = relationObjects.map(object => object[childForeignKey]);
    // set of all the current relationObjects, will remove indexes that are in the newChildren,
    // then delete remaining and return at end
    const relationIndexesToDelete = new Set([...Array(relationObjects.length).keys()]);

    // promise array for all creates and deletes that will need to happen
    const promises = [];

    // loop through the newChildren to create relation if necessary
    for (let i = 0; i < newChildren.length; i += 1) {
        const relationObjectIndex = relationIds.indexOf(newChildren[i].id);

        // if they don't exist in the current relations, create new relation
        if (relationObjectIndex === -1) {
            promises.push(
                joinTableModel.create(
                    {
                        [parentForeignKey]: parentInstanceId,
                        [childForeignKey]: newChildren[i].id,
                        // if sortOrder field doesn't exist, sequelize will not attempt to insert this value, so no error
                        sortOrder: i,
                        createdById: updatingUserId,
                        updatedById: updatingUserId,
                        ...additionalJoinTableCreateFields
                    },
                    { transaction }
                )
            );
        }
        // if the newChild existed, then remove that index from the list to be deleted
        else {
            relationIndexesToDelete.delete(relationObjectIndex);

            // update sort order if necessary
            if (hasSortOrder) {
                relationObjects[relationObjectIndex].sortOrder = i;
                relationObjects[relationObjectIndex].updatedById = updatingUserId;
                promises.push(relationObjects[relationObjectIndex].save({ transaction }));
            }
        }
    }

    // for all indexes of the current relations that were not in the new set, delete them
    const deletedRelationObjects: JoinTableEntity[] = [];
    for (const index of relationIndexesToDelete) {
        relationObjects[index].deletedById = updatingUserId;
        relationObjects[index].deletedAt = fn('NOW');
        promises.push(relationObjects[index].save({ transaction }));
        deletedRelationObjects.push(relationObjects[index]);
    }

    // resolve all promises
    await Promise.all(promises);

    // return the join table models that were deleted
    return deletedRelationObjects;
}
