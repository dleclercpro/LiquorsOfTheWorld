export type User = {
    username: string,
}

export type DatabaseUser = User & {
    hashedPassword: string,
}