import { ENV } from './config'; // Do NOT remove!
import router from './routes';
import logger from './logger';
import APP_SERVER from './models/AppServer';



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    await APP_SERVER.setup(router);
    await APP_SERVER.start();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;