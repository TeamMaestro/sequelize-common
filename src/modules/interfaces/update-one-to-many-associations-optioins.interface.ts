import { Transaction } from 'sequelize';

export interface UpdateOneToManyAssociationsOptions {
    currentChildren: any[];
    newChildren: any[];
    updatingUserId: number;
    childPrimaryKey?: string;
    hasSortOrder?: boolean;
    transaction?: Transaction;
}
