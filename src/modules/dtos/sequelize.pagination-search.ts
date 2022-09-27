import { PaginationSearch, OrderByOptions } from '@teammaestro/nestjs-common';
import { FindOptions } from 'sequelize/types';

export class SequelizePaginationSearch extends PaginationSearch {
    getFindOptions(
        options: {
            orderByOptions?: OrderByOptions;
        } = {}
    ) {
        const paginationFindOptions: FindOptions = {
            include: this.search ? [this.search] : [],
            limit: this.size,
            offset: this.offset,
            order: this.getOrderBy(options?.orderByOptions ?? {})
        };
        return paginationFindOptions;
    }
}
