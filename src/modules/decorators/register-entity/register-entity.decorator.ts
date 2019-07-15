import { Model } from 'sequelize-typescript';
import { EntityRegistration } from './entity-registration';

// tslint:disable-next-line: ban-types
export function RegisterEntity(): ClassDecorator {
    return (target) => {
        EntityRegistration.registerEntity(target as unknown as typeof Model);
    };
}
