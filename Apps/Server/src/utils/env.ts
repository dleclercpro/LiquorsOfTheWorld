import dotenv from 'dotenv';
import { Environment } from '../types';
import { ENVIRONMENTS } from '../constants';



export const loadEnvironment = () => {
    const env = process.env.ENV as Environment;
    
    if (env === undefined) {
        console.error(`Missing environment variable.`);
        process.exit(-1);    
    }
    
    if (!ENVIRONMENTS.includes(env)) {
        console.error(`Invalid environment variable: ${env}`);
        process.exit(-1);
    }

    dotenv.config();

    return env;
}



export const getEnvironmentVariable = (name: string, required: boolean = false) => {
    const variable = process.env[name];

    if (required && !variable) {
        throw new Error(`Environment variable missing: ${name}`);
    }

    return variable;
}