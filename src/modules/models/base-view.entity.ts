import * as Sequelize from 'sequelize';
import { Model, Table } from 'sequelize-typescript';
import { FindOptions } from 'sequelize/types';

@Table({
    timestamps: false,
    underscored: true,
    freezeTableName: true
})
export class BaseViewEntity<i> extends Model<BaseViewEntity<i>> {

    static findOne<M extends BaseViewEntity<any>>(options: FindOptions): Sequelize.Promise<M> {
        return new Sequelize.Promise((resolve, reject) => {
            this.findAll(options).then(results => {
                resolve((results && results.length > 0 ? results[0] : undefined) as any);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
