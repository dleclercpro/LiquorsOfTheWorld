import { QuizName } from '../constants'

export type SessionUser = {
    username: string,
    teamId: string,
    isAdmin: boolean,
}

export type SessionQuiz = {
    name: QuizName,
    id: string,
}