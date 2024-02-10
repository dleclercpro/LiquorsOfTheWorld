import bcrypt from 'bcrypt';

const EPSILON: number = Math.pow(10, -9);

export const equals = (x: number, y: number, epsilon: number = EPSILON) => {
    return Math.abs(x - y) < epsilon;
}

export const round = (x: number, decimals: number) => {
    const pow = Math.pow(10, decimals)

    return Math.round(x * pow) / pow;
}

export const sum = (arr: number[]) => {
    return arr.reduce((count, x) => count + x, 0);
}

export const getAverage = (arr: number[]) => {
    return sum(arr) / arr.length;
}

export const getRange = (size: number) => {
    return [...Array(size).keys()];
}

export const isPasswordValid = async (password: string, hashedPassword: string) => {
    const isValid = await new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, isEqualAfterHash) => {
            if (err) {
                resolve(false);
                return;
            }
  
            if (!isEqualAfterHash) {
                resolve(false);
                return;
            }
  
            resolve(true);
        });
    });
  
    return isValid;
  }