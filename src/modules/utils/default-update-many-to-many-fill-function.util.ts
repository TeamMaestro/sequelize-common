import { UpdateManyToManyAssociationsOptions } from '../interfaces';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { CreatedByEntity } from '../models';
import { AttributesOf } from '../types';
import { UpdateAssociationFillFunction } from '../types/update-association-fill-function.type';

export function defaultUpdateManyToManyFillFunction<T extends CreatedByEntity<T>>(childForeignKey: keyof AttributesOf<T>): UpdateAssociationFillFunction<T, AuthenticatedUser, any> {
    return (newChild: CreatedByEntity<any>, _index: number, _existingRecord: T, updateOptions: UpdateManyToManyAssociationsOptions<T, AuthenticatedUser>) => {
        const { parentForeignKey, parentInstanceId } = updateOptions;
        const newJoinTableRecord: AttributesOf<T> = {
            [childForeignKey]: newChild.id,
            [parentForeignKey]: parentInstanceId
        } as unknown as AttributesOf<T>;

        return newJoinTableRecord;
    };
}
