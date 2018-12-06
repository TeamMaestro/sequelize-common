import { Transaction } from 'sequelize';

export interface UpdateOneToManyAssociationsOptions {
    currentChildren: any[];
    newChildren: any[];
    updatingUserId: number;
    hasSortOrder?: boolean;
    transaction?: Transaction;
}
