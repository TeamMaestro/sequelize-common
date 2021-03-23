import * as Sequelize from 'sequelize';
import { getAttributes, Model, Table } from 'sequelize-typescript';
import { FindOptions } from 'sequelize/types';
import { AttributesOf } from '../types/attributes-of.type';

@Table({
    timestamps: false,
    underscored: true,
    freezeTableName: true
})
export class BaseViewEntity<i> extends Model<BaseViewEntity<i>> {

    static findOne<M extends BaseViewEntity<any>>(options: FindOptions): Sequelize.Promise<M> {
        return new Promise((resolve, reject) => {
            this.findAll(options).then(results => {
                resolve((results && results.length > 0 ? results[0] : undefined) as any);
            }).catch(error => {
                reject(error);
            });
        }) as unknown as Sequelize.Promise<M>;
    }

    /**
     * Returns all of the columns defined for the model of the base repository
     */
    static getTableColumns(includeTableName = false): string[] {
        // get all defined attributes for the model
        const columnDefinitions = getAttributes(this.prototype);
        // for each property use the field definition if exists, otherwise use the property name
        const properties = Object.keys(columnDefinitions);
        const columns: string[] = [];
        properties.forEach(property => {
            if (property) {
                const columnDefinition = columnDefinitions[property];
                if (columnDefinition.type === Sequelize.VIRTUAL) {
                    return;
                }
                if (columnDefinition.field) {
                    if (includeTableName) {
                        return columns.push(`${this.getTableName()}.${columnDefinition.field}`);
                    } else {
                        return columns.push(columnDefinition.field);
                    }
                }
            }
            if (includeTableName) {
                return columns.push(`${this.getTableName()}.${property}`);
            } else {
                return columns.push(property);
            }
        });
        return columns;
    }

    static getColumnNames<M extends BaseViewEntity<any>>(this: { new(): M }, propertyNames: (keyof AttributesOf<M>)[], includeTableName = false): string[] {
        return propertyNames.map(propertyName => (this as any).getColumnName(propertyName, includeTableName));
    }

    static getColumnName<M extends BaseViewEntity<any>>(this: { new(): M }, propertyName: keyof AttributesOf<M>, includeTableName = false): string {
        const ctor = this as unknown as typeof BaseViewEntity;
        const columnDefinitions = getAttributes(ctor.prototype);
        const columnDefinition = columnDefinitions[propertyName as string];
        let columnName: string;
        if (!columnDefinition) {
            throw new Error(`${propertyName} is not defined for the entity ${ctor.name}`);
        } else if (columnDefinition.type === Sequelize.VIRTUAL) {
            throw new Error(`${propertyName} is a virtual property and therefore is not a column`);
        } else if (columnDefinition.field) {
            columnName = columnDefinition.field;
        } else {
            columnName = propertyName as string;
        }
        if (includeTableName) {
            return `${ctor.tableName}.${columnName}`;
        }
        return columnName;
    }

    static attachTableNameToColumns(columnNames: string[]) {
        return columnNames.map(columnName => `${this.tableName}.${columnName}`);
    }
}
