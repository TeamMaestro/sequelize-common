import { mergeOptions } from './merge-options.util';
import { updateOneToManyAssociations } from './update-one-to-many-associations.util';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { UpdateManyToManyAssociationsOptions } from '../interfaces/update-many-to-many-associations-options.interface';
import { CreatedByEntity } from '../models/created-by.entity';

export async function updateManyToManyAssociations<
    T extends CreatedByEntity<T>,
    AuthenticatedUserType extends AuthenticatedUser = AuthenticatedUser,
    NewChildrenType = any
>(options: UpdateManyToManyAssociationsOptions<T, AuthenticatedUserType, NewChildrenType>) {
    const { joinTableFindAttributes, joinTableModel, parentForeignKey, parentInstanceId, additionalJoinTableFindOptions = {} } = options;
    // get the current join table objects
    const existingChildren: T[] = await joinTableModel.findAll(mergeOptions({
        attributes: joinTableFindAttributes as unknown as string[],
        where: { [parentForeignKey]: parentInstanceId }
    }, additionalJoinTableFindOptions)) as T[];
    // update those associations
    return await updateOneToManyAssociations({
        ...options,
        childTableModel: joinTableModel,
        currentChildren: existingChildren
    });
}
