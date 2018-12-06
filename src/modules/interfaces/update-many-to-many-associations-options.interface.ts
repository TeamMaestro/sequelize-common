import { Transaction } from 'sequelize';
import { JoinTableEntity } from '../models/join-table.entity';

export interface UpdateManyToManyAssociationsOptions {
    parentInstanceId: number;
    joinTableModel: typeof JoinTableEntity;
    parentForeignKey: string;
    childForeignKey: string;
    newChildren: any[];
    updatingUserId: number;
    transaction?: Transaction;
    hasSortOrder?: boolean;
}
