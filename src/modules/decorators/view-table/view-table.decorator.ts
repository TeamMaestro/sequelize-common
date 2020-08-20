import { Table, TableOptions } from 'sequelize-typescript';

export const VIEW_TABLE_KEY = 'teamhive-sequelize:view-table';

export function View(options: TableOptions): ClassDecorator {
    return target => {
        Reflect.defineMetadata(VIEW_TABLE_KEY, target.name, target);

        Table(options)(target);
    };
}
