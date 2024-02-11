export type User = {
    username: string,
    questionIndex: number,
}

export type DatabaseUser = User & {
    hashedPassword: string,
}