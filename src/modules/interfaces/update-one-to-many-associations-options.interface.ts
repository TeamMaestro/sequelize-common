import { Transaction } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
import { AuthenticatedUser } from './authenticated-user.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';
import { AttributesOf } from '../types';

export interface UpdateOneToManyAssociationsOptions<
    T extends JoinTableEntity | CreatedByEntity<T>,
    AuthenticatedUserType extends AuthenticatedUser = AuthenticatedUser,
    NewChildrenType = any
    > {
    /**
     * The user updating the association
     */
    user: AuthenticatedUserType;
    /**
     * The sequelize model of the child table.
     */
    childTableModel: ModelCtor<T>;
    /**
     * The existing children
     */
    currentChildren: T[];
    /**
     * These records are compare with existing records to determine
     * if creates/updates/deletes are necessary and they are used to
     * fill the associated table records.
     */
    newChildren: NewChildrenType[];
    /**
     * This function will compare a new child with the set of existing records
     * that have not been matched. It should return the index of the existing record
     * if there is a match. If there is no match, a negative number should be returned.
     */
    comparisonFunction: (existingRecords: T[], newChild: NewChildrenType) => number;
    /**
     * This function will be called to create the values that will be written to the
     * child table.
     * @param newChild The child to create/update
     * @param index Index of newChild in the newChildren array (use this for sort order)
     * @param existingRecord If there was a match, the existing record will be included
     */
    fillFunction: (user: AuthenticatedUserType, newChild: NewChildrenType, index: number, existingRecord?: T) => AttributesOf<T>;
    /**
     * The transaction to run the update in
     */
    transaction: Transaction;
}
