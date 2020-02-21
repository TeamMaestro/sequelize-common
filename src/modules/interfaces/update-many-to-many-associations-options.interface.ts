import { ModelCtor } from 'sequelize-typescript';
import { AuthenticatedUser } from './authenticated-user.interface';
import { UpdateOneToManyAssociationsOptions } from './update-one-to-many-associations-options.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';
import { AttributesOf } from '../types';

export interface UpdateManyToManyAssociationsOptions<
    T extends JoinTableEntity | CreatedByEntity<T>,
    AuthenticatedUserType extends AuthenticatedUser = AuthenticatedUser,
    NewChildrenType = any
    > extends
    Omit<
    Omit<UpdateOneToManyAssociationsOptions<T, AuthenticatedUserType, NewChildrenType>, 'childTableModel'>,
    'currentChildren'> {
    /**
     * The id of the parent instance
     */
    parentInstanceId: number;
    /**
     * The sequelize model to use as a join table
     */
    joinTableModel: ModelCtor<T>;
    /**
     * The column name for foreign key on the join table for the parent
     */
    parentForeignKey: keyof AttributesOf<T>;
    /**
     * Attributes to request from the database.  These are used when determining
     * if the child exists and to what parent it is related.  Should be given
     * if default scope does not include enough information.
     */
    joinTableFindAttributes: (keyof AttributesOf<T>)[];
}
