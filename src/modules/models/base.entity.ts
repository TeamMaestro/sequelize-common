import * as Sequelize from 'sequelize';
import { FindOptions } from 'sequelize';
import { Column, Default, Model, Table, Unique } from 'sequelize-typescript';
import { SequelizeDate } from '../types/sequelize-date.type';

@Table({
    paranoid: true,
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    defaultScope: {
        attributes: ['id', 'identity']
    },
})
export class BaseEntity<i> extends Model<BaseEntity<i>> {
    @Unique
    @Default(Sequelize.UUIDV4)
    @Column({
        type: Sequelize.UUID,
        field: 'identity'
    })
    identity: string;

    @Column({
        type: Sequelize.DATE,
        field: 'created_at'
    })
    createdAt: SequelizeDate;

    @Column({
        type: Sequelize.DATE,
        field: 'updated_at'
    })
    updatedAt: SequelizeDate;

    @Column({
        type: Sequelize.DATE,
        field: 'deleted_at'
    })
    deletedAt: SequelizeDate;

    static findOne<M extends BaseEntity<any>>(options: FindOptions): Sequelize.Promise<M> {
        return new Sequelize.Promise((resolve, reject) => {
            this.findAll(options).then(results => {
                resolve((results && results.length > 0 ? results[0] : undefined) as any);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
