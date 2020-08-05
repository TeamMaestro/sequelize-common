import { Op, WhereOptions } from 'sequelize';

export function getSearchWhereClause(searchTerms = ''): WhereOptions {
    const whereClauses = [];
    if (searchTerms.length > 0) {
        const regEx = /[^\s"]+|"([^"]*)"/gi;
        const searchSplit = [];

        let match: RegExpExecArray;
        do {
            // Each call to exec returns the next regex match as an array
            match = regEx.exec(searchTerms);
            if (match != null) {
                // Index 1 in the array is the captured group if it exists
                // Index 0 is the matched text, which we use if no captured group exists
                searchSplit.push(match[1] ? match[1] : match[0]);
            }
        } while (match != null);

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
