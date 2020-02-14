import { Transaction } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
import { InstanceSpecificJoinTableField } from './instance-specific-join-table-field.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';
import { AttributesOf } from '../types';

export interface UpdateManyToManyAssociationsOptions<
    T extends JoinTableEntity | CreatedByEntity<T>
> {
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
     * The column name for the foreign on the join table for the child
     */
    childForeignKey: keyof AttributesOf<T>;
    /**
     * The new child with the that has the parentForeignKey, childForeignKey,
     * possibly sort order, and additional fields for the join table.
     */
    newChildren: any[];
    /**
     * The user updating the association
     */
    updatingUserId: number;
    /**
     * Fields that are created/updated in on the join table based on their
     * values on the child.
     */
    childCreateOrUpdateFields?: string[];
    /**
     * The key on the children object to be used as the child primary key
     */
    childPrimaryKey?: string;
    /**
     * The keys used to determine if the child is a duplicate or if it already exists.
     * Useful when multiple properties on the child determine uniqueness.
     */
    childComparisonKeys?: string[];
    /**
     * Attributes to request from the database.  These are used when determining
     * if the child exists and to what parent it is related.  Should be given
     * if default scope does not include enough information.
     */
    joinTableFindAttributes?: string[];
    /**
     * The transaction to run the update in
     */
    transaction?: Transaction;
    /**
     * If true, sort order will be examined and updated on the child
     */
    hasSortOrder?: boolean;
    /**
     *
     */
    instanceSpecificJoinTableFields?: InstanceSpecificJoinTableField[];
    /**
     * These fields will be added to all children objects when created.
     */
    additionalJoinTableCreateFields?: any;
}
