import { Model } from 'sequelize-typescript';
import { EmptyModel } from '../models/empty-model.entity';
import { Diff } from '../types';

// include 'version' here?
type IncludedModelAttributes = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';
export type AttributesArray<T extends Model<T>> = Diff<keyof T, Diff<keyof EmptyModel, IncludedModelAttributes>>[];

/**
 * Type check that makes sure input array is a custom attribute
 * of T (an entity). The type is created by all keys of T
 * that do not exist in an empty sequelize model (Empty Model),
 * but including the IncludeModelAttributes.
 */
export function getAttributes<T extends Model<T>>(
    attributes: AttributesArray<T>
) {
    return attributes;
}
