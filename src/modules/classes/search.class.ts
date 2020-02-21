import { Model } from 'sequelize-typescript';
import { getSearchWhereClause } from '../utils';

export class Search {
    include: any;

    constructor(model: typeof Model, searchTerms: string = '', alias: string = 'search') {
        if (searchTerms.length > 0) {
            const whereClause = getSearchWhereClause(searchTerms);
            this.include = {
                model,
                as: alias,
                where: whereClause
            };
        }
    }
}
