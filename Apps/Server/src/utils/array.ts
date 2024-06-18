export const getRandom = <V> (arr: V[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const getFirst = <V> (arr: V[]) => {
    if (arr.length > 0) return arr[0];
}

export const getLast = <V> (arr: V[]) => {
    if (arr.length > 0) return arr[arr.length - 1];
}

export const getRange = (size: number) => {
    return [...Array(size).keys()];
}

export const shuffle = <T> (array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const flatten = <V> (arr: V[][]) => {
    return arr.reduce((prevValues, values) => {
        return [...prevValues, ...values];
    }, []);
}

export const unique = <V> (arr: V[]) => {
    return [...new Set(arr)];
}