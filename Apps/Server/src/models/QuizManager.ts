import { LANGUAGES, Language, QUIZ_NAMES, QuizName } from '../constants';
import { QuizJSON } from '../types/JSONTypes';

type QuizDirectory = Record<Language, Record<QuizName, QuizJSON | null>>;

class QuizManager {
    private static instance: QuizManager;

    private quizzes: QuizDirectory;

    private constructor() {
        this.quizzes = LANGUAGES.reduce((prevLang, currLang) => {
            return {
                ...prevLang,
                [currLang]: QUIZ_NAMES.reduce((prev, curr) => {
                    return {
                        ...prev,
                        [curr]: null,
                    };
                }, {})
            }
        }, {} as QuizDirectory);
    }

    public static getInstance() {
        if (!QuizManager.instance) {
            QuizManager.instance = new QuizManager();
        }
        return QuizManager.instance;
    }

    private async load(name: QuizName, language: Language) {
        this.quizzes[language][name] = (await import(`../../data/${language}/${name}.json`)).default;
    }

    public async get(name: QuizName, language: Language = Language.EN) {
        if (this.quizzes[language][name] === null) {
            await this.load(name, language);
        }
        return this.quizzes[language][name] as QuizJSON;
    }

    public async count(name: QuizName) {
        const json = await this.get(name);

        if (json === null) {
            throw new Error('QUIZ_DATA_NOT_LOADED');
        }

        return Object.keys(json).length;
    }
}

export default QuizManager.getInstance();