export const prettifyJSON = (json: object) => JSON.stringify(json, undefined, 2);

export const parseNumberText = (text?: string): number => {
    const isNumber = !Number.isNaN(Number(text));

    if (!isNumber) {
        throw new Error('WRONG_TYPE');
    }

    return Number(text);
}

export const parseBooleanText = (text?: string): boolean => {
    const isBoolean = ['true', 'false'].includes((text || '').toLowerCase());

    if (!isBoolean) {
        throw new Error('WRONG_TYPE');
    }

    return text === 'true';
}