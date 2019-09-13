import { Transaction } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';
import { InstanceSpecificJoinTableField } from './instance-specific-join-table-field.interface';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';
import { AttributesOf } from '../types';

export interface UpdateManyToManyAssociationsOptions<T extends JoinTableEntity | CreatedByEntity<T>> {
    parentInstanceId: number;
    joinTableModel: ModelCtor<T>;
    parentForeignKey: keyof AttributesOf<T>;
    childForeignKey: keyof AttributesOf<T>;
    newChildren: any[];
    updatingUserId: number;
    transaction?: Transaction;
    hasSortOrder?: boolean;
    instanceSpecificJoinTableFields?: InstanceSpecificJoinTableField[];
    additionalJoinTableCreateFields?: any;
}
