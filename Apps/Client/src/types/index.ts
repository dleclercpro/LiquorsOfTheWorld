export type Auth = {
  username: string,
  password: string,
}

export type LoginData = Auth & {
  quizId: string,
}