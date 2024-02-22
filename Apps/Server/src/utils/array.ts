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

export const flatten = <V> (arr: V[][]) => {
    return arr.reduce((prevValues, values) => {
        return [...prevValues, ...values];
    }, []);
}

export const unique = <V> (arr: V[]) => {
    return [...new Set(arr)];
}