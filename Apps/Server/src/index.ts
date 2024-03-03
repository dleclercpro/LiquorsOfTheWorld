import _ from './types/Express'; // Do NOT remove!
import { REDIS_HOST, REDIS_NAME, REDIS_PORT, ENV, ADMINS } from './config'; // Do NOT remove!
import logger from './logger';
import APP_SERVER from './models/AppServer';
import AppDatabase from './models/databases/AppDatabase';



export const APP_DB = new AppDatabase({
    host: REDIS_HOST,
    port: REDIS_PORT,
    name: REDIS_NAME,
});



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_DB.start();

    // Create admin users if they don't already exist
    ADMINS.forEach(async ({ username, password }) => {
        const admin = await APP_DB.getUser(username);
        
        if (!admin) {
            await APP_DB.createUser(username, password, true);
        }
    });

    await APP_SERVER.setup();
    await APP_SERVER.start();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;