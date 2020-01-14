import { UpdateOneToManyAssociationsOptions } from '../interfaces/update-one-to-many-associations-optioins.interface';

export async function updateOneToManyAssociations(
    {
        currentChildren,
        newChildren,
        hasSortOrder,
        updatingUserId,
        childPrimaryKey = 'id',
        transaction
    }: UpdateOneToManyAssociationsOptions
) {
    // map current objects to an array of ids
    const currentChildrenIds = currentChildren.map(currentChild => currentChild[childPrimaryKey]);
    // set of all the current indexes of currentChildren, will remove indexes that are in the newChildren,
    // then delete any that remain in the set
    const currentChildrenIndexesToDelete = new Set([...Array(currentChildren.length).keys()]);

    // promise array for all creates and deletes that will need to happen
    const promises = [];

    // loop through the newChildren to remove indexes that don't need tro be deleted
    for (let i = 0; i < newChildren.length; i += 1) {
        // if there is sort order, set it on the new child
        if (hasSortOrder) {
            newChildren[i].sortOrder = i;
            newChildren[i].updatedById = updatingUserId;
            promises.push(newChildren[i].save({ transaction }));
        }

        const currentChildIndex = currentChildrenIds.indexOf(newChildren[i][childPrimaryKey]);

        // if new child exists in the current children, set that index to not be deleted
        if (currentChildIndex !== -1) {
            currentChildrenIndexesToDelete.delete(currentChildIndex);
        }
    }

    // for all indexes of the current children that were not in the new set, delete them
    const deletedChildren = [];
    for (const index of currentChildrenIndexesToDelete) {
        currentChildren[index].deletedById = updatingUserId;
        promises.push(currentChildren[index].destroy({ transaction }));
        deletedChildren.push(currentChildren[index]);
    }

    // resolve all promises
    await Promise.all(promises);

    return deletedChildren;
}
