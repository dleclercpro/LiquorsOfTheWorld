import _ from './types/Express'; // Do NOT remove!
import { REDIS_HOST, REDIS_NAME, REDIS_PORT, ENV } from './config'; // Do NOT remove!
import logger from './logger';
import APP_SERVER from './models/AppServer';
import RedisDatabase from './models/databases/base/RedisDatabase';



export const REDIS_DB = new RedisDatabase({
    host: REDIS_HOST,
    port: REDIS_PORT,
    name: REDIS_NAME,
});



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await REDIS_DB.start();

    await APP_SERVER.setup();
    await APP_SERVER.start();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;