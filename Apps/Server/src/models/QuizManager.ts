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

    private async load(name: QuizName, lang: Language) {
        this.quizzes[lang][name] = (await import(`../../data/${lang}/${name}.json`)).default;
    }

    public async get(name: QuizName, lang: Language = Language.EN) {
        if (this.quizzes[lang][name] === null) {
            await this.load(name, lang);
        }
        return this.quizzes[lang][name] as QuizJSON;
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