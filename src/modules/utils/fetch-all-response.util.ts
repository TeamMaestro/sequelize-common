import { FindAndCountAllResponse } from '../interfaces/find-and-count-all-response.interface';

export function fetchAllResponse<T, ResponseClass = any, AdditionalParams = any>(
    response: FindAndCountAllResponse<T>,
    responseClass: new (content: T, additionalParams?: AdditionalParams) => ResponseClass,
    additionalParamFunction?: (content: T) => AdditionalParams
): FetchAllResponse<ResponseClass> {
    const content = [];
    if (response.rows && response.rows.length > 0) {
        content.push(
            ...response.rows.map((row) => {
                const additionalParams: AdditionalParams = additionalParamFunction
                    ? additionalParamFunction(row)
                    : undefined;
                return new responseClass(row, additionalParams);
            })
        );
    }
    return {
        content,
        totalElements: response.count
    };
}

export interface FetchAllResponse<T> {
    content: T[];
    totalElements: number;
}
