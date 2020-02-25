import { CreatedByEntity } from '../models';
import { AttributesOf } from '../types/attributes-of.type';

export function defaultUpdateAssociationComparisonFunction<T extends CreatedByEntity<T>, S extends CreatedByEntity<T>>(childForeignKey: keyof AttributesOf<T>) {
    return (existingGroups: T[], newGroup: S) => {
        return existingGroups.findIndex((existingGroup) => existingGroup[childForeignKey] as unknown as number === newGroup.id);
    };
}
