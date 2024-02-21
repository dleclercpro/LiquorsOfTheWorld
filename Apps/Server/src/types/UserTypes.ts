export type User = {
    username: string,
    isAdmin: boolean,
}

export type DatabaseUser = User & {
    hashedPassword: string,
}