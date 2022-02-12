import { Pagination } from '@teammaestro/nestjs-common';
import { FindOptions } from 'sequelize/types';

export class SequelizePaginationDto extends Pagination {
    getFindOptions() {
        const paginationFindOptions: FindOptions = {
            limit: this.size,
            offset: this.offset,
            order: this.getOrderBy()
        };
        return paginationFindOptions;
    }
}
