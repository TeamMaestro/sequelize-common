import { Model } from 'sequelize-typescript';

export class EntityRegistration {
    private static models: (typeof Model)[] = [];

    static registerEntity(model: typeof Model) {
        // tslint:disable-next-line: no-console
        console.log(`registering entity: ${model.name}`);
        EntityRegistration.models.push(model);
    }

    static getEntities() {
        return EntityRegistration.models;
    }
}
