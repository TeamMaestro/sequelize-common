import { Model, Table } from 'sequelize-typescript';

@Table({
    timestamps: false,
    underscored: true,
    freezeTableName: true
})
export class BaseViewEntity<i> extends Model<BaseViewEntity<i>> {}
