import { Op, WhereOptions } from 'sequelize';

export function getSearchWhereClause(searchTerms = ''): WhereOptions {
    const whereClauses = [];
    if (searchTerms.length > 0) {
        const searchSplit = searchTerms.split(' ');
        searchSplit.forEach(term => {
            whereClauses.push({
                // TODO: Why does this have to be underscored??
                search_term: {
                    [Op.iLike]: `%${term}%`
                }
            });
        });
    }
    return {
        [Op.and]: whereClauses
    };
}
