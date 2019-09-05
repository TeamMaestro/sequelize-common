import { ModelCtor } from 'sequelize-typescript';

export class EntityRegistration {
    private static models: ModelCtor<any>[] = [];

    static registerEntity(model: ModelCtor<any>) {
        EntityRegistration.models.push(model);
    }

    static getEntities() {
        return EntityRegistration.models;
    }
}
