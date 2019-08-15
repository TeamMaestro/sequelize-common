import { Transaction } from 'sequelize';
import { CreatedByEntity } from '../models/created-by.entity';
import { JoinTableEntity } from '../models/join-table.entity';
import { AttributesOf } from '../types';

export interface UpdateManyToManyAssociationsOptions<T> {
    parentInstanceId: number;
    joinTableModel: typeof JoinTableEntity | typeof CreatedByEntity;
    parentForeignKey: keyof AttributesOf<T>;
    childForeignKey: keyof AttributesOf<T>;
    newChildren: any[];
    updatingUserId: number;
    transaction?: Transaction;
    hasSortOrder?: boolean;
    additionalJoinTableCreateFields?: any;
}
