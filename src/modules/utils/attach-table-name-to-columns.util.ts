import { attachTableNameToColumn } from './attach-table-name-to-column.util';

export function attachTableNameToColumns(columns: string[], tableName: string) {
    return columns.map(column => {
        return attachTableNameToColumn(column, tableName);
    });
}
