import { CreatedByEntity } from '../models';
import { AttributesOf } from '../types/attributes-of.type';

export function defaultUpdateAssociationComparisonFunction<T extends CreatedByEntity<T>, S extends { id: number }>(childForeignKey: keyof AttributesOf<T>) {
    return (existingRecords: T[], newChild: S) => {
        return existingRecords.findIndex((existingGroup) => existingGroup[childForeignKey] as unknown as number === newChild.id);
    };
}
