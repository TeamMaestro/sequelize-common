import { FindOptions } from 'sequelize/types';

export abstract class SequelizeFilter {
    protected abstract getFindOptions(findOptions?: FindOptions): FindOptions;
}
