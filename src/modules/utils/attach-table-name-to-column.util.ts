export function attachTableNameToColumn(column: string, tableName: string) {
    return `${tableName}.${column}`;
}
