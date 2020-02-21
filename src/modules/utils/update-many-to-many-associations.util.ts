import { updateOneToManyAssociations } from './update-one-to-many-associations.util';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { UpdateManyToManyAssociationsOptions } from '../interfaces/update-many-to-many-associations-options.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';

export async function updateManyToManyAssociations<
    T extends JoinTableEntity | CreatedByEntity<T>,
    AuthenticatedUserType extends AuthenticatedUser = AuthenticatedUser,
    NewChildrenType = any
>(options: UpdateManyToManyAssociationsOptions<T, AuthenticatedUserType, NewChildrenType>) {
    const { joinTableFindAttributes, joinTableModel, parentForeignKey, parentInstanceId } = options;
    // get the current join table objects
    const existingChildren: T[] = await joinTableModel.findAll({
        attributes: joinTableFindAttributes as unknown as string[],
        where: { [parentForeignKey]: parentInstanceId }
    }) as T[];
    // update those associations
    return await updateOneToManyAssociations({
        ...options,
        childTableModel: joinTableModel,
        currentChildren: existingChildren
    });
}
