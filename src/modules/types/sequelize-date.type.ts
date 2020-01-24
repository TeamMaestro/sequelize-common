import { Fn } from 'sequelize/types/lib/utils';

/**
 * @deprecated Use SequelizeFunctionType<Date> instead
 */
export type SequelizeDate = Date | string | Fn;
