import { DB_HOST, DB_NAME, DB_PORT, ENV, PORT } from './config'; // Do NOT remove!
import router from './routes';
import logger from './logger';
import APP_SERVER from './models/AppServer';
import RedisDatabase from './models/databases/RedisDatabase';



export const REDIS_DB = new RedisDatabase({
    host: DB_HOST,
    port: DB_PORT,
    name: DB_NAME,
});



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await REDIS_DB.start();

    await APP_SERVER.setup(router);
    await APP_SERVER.start();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;