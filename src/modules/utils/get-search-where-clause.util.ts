import { Op, WhereOptions } from 'sequelize';
import { splitSearchTerm } from './split-search-term.util';

export function getSearchWhereClause(searchTerms = ''): WhereOptions {
    const whereClauses = [];
    if (searchTerms.length > 0) {
        const searchSplit = splitSearchTerm(searchTerms);

        searchSplit.forEach(term => {
            whereClauses.push({
                // TODO: Why does this have to be underscored??
                search_term: {
                    [Op.iLike]: `%${term}%`,
                },
            });
        });
    }
    return {
        [Op.and]: whereClauses,
    };
}
