import { Transaction } from 'sequelize';
import { CreatedByEntity } from '../models';
import { JoinTableEntity } from '../models/join-table.entity';

export interface UpdateManyToManyAssociationsOptions {
    parentInstanceId: number;
    joinTableModel: typeof JoinTableEntity | typeof CreatedByEntity;
    parentForeignKey: string;
    childForeignKey: string;
    newChildren: any[];
    updatingUserId: number;
    transaction?: Transaction;
    hasSortOrder?: boolean;
    additionalJoinTableCreateFields?: any;
}
