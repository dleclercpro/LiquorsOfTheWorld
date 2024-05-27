import _ from './types/Express'; // Do NOT remove!
import { ENV } from './config'; // Do NOT remove!
import logger from './logger';
import AppDatabase from './models/databases/AppDatabase';
import AppServer from './models/AppServer';
import AppRouter from './routes';



export const APP_SERVER = new AppServer();
export const APP_DB = new AppDatabase();



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_DB.start();
    await APP_DB.setup();

    await APP_SERVER.setup(AppRouter);
    await APP_SERVER.start();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;