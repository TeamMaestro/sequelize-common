import { Model } from 'sequelize-typescript';

export class EntityRegistration {
    private static models: (typeof Model)[] = [];

    static registerEntity(model: typeof Model) {
        EntityRegistration.models.push(model);
    }

    static getEntities() {
        return EntityRegistration.models;
    }
}
