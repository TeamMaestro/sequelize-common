import { Model, Table } from 'sequelize-typescript';
import { FindOptions } from 'sequelize/types';

@Table({
    timestamps: false,
    underscored: true,
    freezeTableName: true
})
export class BaseViewEntity<i> extends Model<BaseViewEntity<i>> {

    static async findOne(options?: FindOptions) {
        const results = await this.findAll(options);
        return results && results.length > 0 ? results[0] : undefined;
    }
}
