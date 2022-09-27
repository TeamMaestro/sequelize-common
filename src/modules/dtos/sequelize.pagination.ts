import { OrderByOptions, Pagination } from '@teammaestro/nestjs-common';
import { FindOptions } from 'sequelize/types';

export class SequelizePagination extends Pagination {
    getFindOptions(
        options: {
            orderByOptions?: OrderByOptions;
        } = {}
    ) {
        const paginationFindOptions: FindOptions = {
            limit: this.size,
            offset: this.offset,
            order: this.getOrderBy(options?.orderByOptions ?? {})
        };
        return paginationFindOptions;
    }
}
