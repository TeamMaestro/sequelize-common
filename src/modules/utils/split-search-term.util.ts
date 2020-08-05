export function splitSearchTerm(searchTerms = ''): string[] {
    const searchSplit: string[] = [];
    if (searchTerms.length > 0) {
        const regEx = /[^\s"]+|"([^"]*)"/gi;

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
    }
    return searchSplit;
}
