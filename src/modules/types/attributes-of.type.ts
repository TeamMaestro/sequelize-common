import { EmptyModel } from '../models';

type IncludedModelAttributes = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';
type PropertiesToOmit = Exclude<keyof EmptyModel, IncludedModelAttributes>;

export type AttributesOf<T> = Partial<Omit<T, PropertiesToOmit>>;
