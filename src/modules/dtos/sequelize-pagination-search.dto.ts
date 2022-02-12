import { PaginationSearch } from '@teammaestro/nestjs-common';
import { FindOptions } from 'sequelize/types';

export class SequelizePaginationSearchDto extends PaginationSearch {
    getFindOptions() {
        const paginationFindOptions: FindOptions = {
            include: this.search ? [this.search] : [],
            limit: this.size,
            offset: this.offset,
            order: this.getOrderBy()
        };
        return paginationFindOptions;
    }
}
