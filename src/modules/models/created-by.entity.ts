import * as Sequelize from 'sequelize';
import { Column, Table } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';

@Table({})
export class CreatedByEntity<i> extends BaseEntity<CreatedByEntity<i>> {
    @Column({
        type: Sequelize.BIGINT,
        field: 'created_by_id'
    })
    createdById: number;

    @Column({
        type: Sequelize.BIGINT,
        field: 'updated_by_id'
    })
    updatedById: number;

    @Column({
        type: Sequelize.BIGINT,
        field: 'deleted_by_id'
    })
    deletedById: number;
}
