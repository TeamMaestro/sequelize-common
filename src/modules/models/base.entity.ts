import * as Sequelize from 'sequelize';
import { Column, Default, Table, Unique } from 'sequelize-typescript';
import { BaseViewEntity } from './base-view.entity';
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
export class BaseEntity<i> extends BaseViewEntity<BaseEntity<i>> {
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
}
