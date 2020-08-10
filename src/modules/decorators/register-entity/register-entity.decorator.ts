import { ModelCtor } from 'sequelize-typescript';
import { EntityRegistration } from './entity-registration';

export function RegisterEntity(databaseName?: string): ClassDecorator {
    return (target) => {
        EntityRegistration.registerEntity(target as unknown as ModelCtor<any>, databaseName);
    };
}
