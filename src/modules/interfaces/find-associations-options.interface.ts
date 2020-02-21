import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';
import { AttributesOf } from '../types/attributes-of.type';

export interface FindExistingAssociationOptions<
    T extends JoinTableEntity | CreatedByEntity<T>
    > {
    /**
     * The id of the parent instance
     */
    parentInstanceId: number;
    /**
     * The column name for foreign key on the join table for the parent
     */
    parentForeignKey: keyof AttributesOf<T>;
    /**
     * Attributes to request from the database.  These are used when determining
     * if the child exists and to what parent it is related.  Should be given
     * if default scope does not include enough information.
     */
    joinTableFindAttributes: string[];
}
