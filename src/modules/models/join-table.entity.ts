import { Column, Sequelize, Table } from 'sequelize-typescript';
import { CreatedByEntity } from './created-by.entity';

@Table({})
export class JoinTableEntity extends CreatedByEntity<JoinTableEntity> {
    // optional additional field to enforce typings on the
    // updateManyToManyAssociations function
    @Column({
        type: Sequelize.INTEGER,
        field: 'sort_order'
    })
    sortOrder?: number;
}
