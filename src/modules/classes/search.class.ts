import { Op } from 'sequelize';
import { Model } from 'sequelize-typescript';

export class Search {
    include: any;

    constructor(model: typeof Model, searchTerms: string = '', alias: string = 'search') {
        if (searchTerms.length > 0) {
            const whereClause = [];
            const searchSplit = searchTerms.split(' ');
            searchSplit.forEach(term => {
                whereClause.push({
                    // TODO: Why does this have to be underscored??
                    search_term: {
                        [Op.iLike]: `%${term}%`
                    }
                });
            });
            this.include = {
                model,
                as: alias,
                where: whereClause
            };
        }
    }
}
