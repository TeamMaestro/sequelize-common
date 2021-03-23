import { FindAndCountOptions, FindOptions, IncludeOptions, WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import deepMerge = require('deepmerge');
import isPlainObject = require('is-plain-object');

export type MergeableOptions =
    | FindOptions
    | FindAndCountOptions
    | WhereOptions
    | IncludeOptions;

const isMergeableObject = (object: any) => {
    if (Array.isArray(object)) {
        return true;
    }
    else {
        return (isPlainObject as any)(object);
    }
};

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
                    { customMerge, arrayMerge: concatArray, isMergeableObject }
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

const _mergeOptions = (
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
        arrayMerge: concatArray,
        isMergeableObject
    });
    attachTransaction(mergedOptions, transaction);
    return (mergedOptions as unknown) as FindOptions;
};

export const mergeOptions = (
    ...options: any[]
): FindOptions => {
    if (options.length === 0) {
        return {};
    }
    else {
        let findOptions = options[0];
        // merge all of the options together one by one
        for(let i = 1; i < options.length; i++) {
            findOptions = _mergeOptions(findOptions, options[i]);
        }
        return findOptions;
    }
};
