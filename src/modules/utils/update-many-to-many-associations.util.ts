import { UpdateManyToManyAssociationsOptions } from '../interfaces/update-many-to-many-associations-options.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';

export async function updateManyToManyAssociations<T extends JoinTableEntity | CreatedByEntity<T>>(
    {
        parentInstanceId,
        joinTableModel,
        parentForeignKey,
        childForeignKey,
        newChildren,
        updatingUserId,
        transaction,
        hasSortOrder,
        instanceSpecificJoinTableFields,
        additionalJoinTableCreateFields
    }: UpdateManyToManyAssociationsOptions<T>
) {

    // get the current join table objects
    const relationObjects = await joinTableModel.findAll({
        where: { [parentForeignKey]: parentInstanceId }
    });
    // map the objects to be an array of the child ids
    const relationIds = relationObjects.map(object => object[childForeignKey as string]);
    // set of all the current relationObjects, will remove indexes that are in the newChildren,
    // then delete remaining and return at end
    const relationIndexesToDelete = new Set([...Array(relationObjects.length).keys()]);

    // additional fields that will be added to the association table
    if (!instanceSpecificJoinTableFields) {
            // set custom fields to empty array if not sent
            instanceSpecificJoinTableFields = [];
    }

    // promise array for all creates and deletes that will need to happen
    const promises = [];

    // loop through the newChildren to create relation if necessary
    for (let i = 0; i < newChildren.length; i += 1) {
        const relationObjectIndex = relationIds.indexOf(newChildren[i].id);

        // if they don't exist in the current relations, create new relation
        if (relationObjectIndex === -1) {

            // check for custom table fields
            const customFieldMatch = instanceSpecificJoinTableFields.find(instance => {
                return instance.identity === newChildren[i].identity;
            });

            let customTableFields = [];
            if (customFieldMatch && customFieldMatch.fields) {
                customTableFields = customFieldMatch.fields;
            }

            promises.push(
                joinTableModel.create(
                    {
                        [parentForeignKey as string]: parentInstanceId,
                        [childForeignKey as string]: newChildren[i].id,
                        // if sortOrder field doesn't exist, sequelize will not attempt to insert this value, so no error
                        sortOrder: i,
                        createdById: updatingUserId,
                        updatedById: updatingUserId,
                        ...additionalJoinTableCreateFields,
                        ...customTableFields
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
                const instance = relationObjects[relationObjectIndex];
                (instance as JoinTableEntity).sortOrder = i;
                (instance as CreatedByEntity<T>).updatedById = updatingUserId;
                promises.push(relationObjects[relationObjectIndex].save({ transaction }));
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
