import { FindAndCountOptions, FindOptions, IncludeOptions, WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import deepMerge = require('deepmerge');

export type MergeableOptions =
    | FindOptions
    | FindAndCountOptions
    | WhereOptions
    | IncludeOptions;

const includeMerge = (
    baseIncludes: IncludeOptions[],
    requestIncludes: IncludeOptions[]
) => {
    baseIncludes.forEach(baseInclude => {
        let foundMatch = false;
        requestIncludes.forEach((requestInclude, index) => {
            if (
                baseInclude.model === requestInclude.model &&
                baseInclude.as === requestInclude.as
            ) {
                requestIncludes[index] = deepMerge(
                    requestInclude,
                    baseInclude,
                    { customMerge, arrayMerge: concatArray }
                );
                foundMatch = true;
            }
        });
        if (!foundMatch) {
            requestIncludes.push(baseInclude);
        }
    });
    return requestIncludes;
};

const whereMerge = (
    baseWhere: WhereOptions,
    requestWhere: WhereOptions
): WhereOptions => {
    return {
        [Op.and]: [baseWhere, requestWhere]
    };
};

const customMerge = (key: string) => {
    if (key === 'include') {
        return includeMerge;
    }
    if (key === 'where') {
        return whereMerge;
    }
};

const concatArray = (array1: Array<any>, array2: Array<any>) => {
    return [...array1, ...array2];
};

const getTransaction = (baseOptions: any, requestOptions: any) => {
    let transaction;
    if (baseOptions.transaction !== undefined) {
        transaction = baseOptions.transaction;
        baseOptions.transaction = undefined;
    }
    if (requestOptions.transaction !== undefined) {
        transaction = requestOptions.transaction;
        requestOptions.transaction = undefined;
    }
    return transaction;
};

const attachTransaction = (mergedOptions: any, transaction: any) => {
    mergedOptions.transaction = transaction;
};
export const mergeOptions = (
    baseOptions: any = {},
    requestOptions: any = {}
): FindOptions => {
    if (baseOptions === undefined) {
        return requestOptions;
    }
    if (requestOptions === undefined) {
        return baseOptions;
    }
    const transaction = getTransaction(baseOptions, requestOptions);
    const mergedOptions = deepMerge(baseOptions, requestOptions, {
        customMerge,
        arrayMerge: concatArray
    });
    attachTransaction(mergeOptions, transaction);
    return (mergedOptions as unknown) as FindOptions;
};
