import { Model, Table } from 'sequelize-typescript';

@Table({})
export class EmptyModel extends Model<EmptyModel> {}
