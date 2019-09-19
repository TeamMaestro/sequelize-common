import { Model } from 'sequelize-typescript';
import { EmptyModel } from '../models';

type IncludedModelAttributes = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';
type PropertiesToOmit = Exclude<keyof EmptyModel, IncludedModelAttributes>;

export declare type AttributesOf<T extends Model> = Partial<Omit<T, PropertiesToOmit>>;
