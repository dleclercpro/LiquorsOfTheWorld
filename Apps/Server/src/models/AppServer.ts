import http from 'http';
import process from 'process';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { APP_NAME } from '../constants';
import { CLIENT_ROOT, DEV, ENV, PORT } from '../config';
import logger from '../logger';
import Router from '../routes';
import ErrorMiddleware from '../middleware/ErrorMiddleware';
import MissingServerError from '../errors/MissingServerError';

// There can only be one app server: singleton!
class AppServer {
    private static instance?: AppServer;
    
    protected app?: express.Express;
    protected server?: http.Server;

    private constructor() {
    
    }

    public static getInstance() {
        if (!AppServer.instance) {
            AppServer.instance = new AppServer();
        }
        return AppServer.instance;
    }

    public async setup() {
        this.app = express();
        this.server = http.createServer(this.app);
    
        // Enable use of cookies
        this.app.use(cookieParser());
    
        // Enable use of JSON data
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    
        // Enable HTTP response compression
        this.app.use(compression());

        // Allow all origins in dev mode
        if (DEV) {
            logger.debug(`Enabling CORS...`);

            this.app.use(cors({
                origin: CLIENT_ROOT,
                credentials: true,
            }));
        }
    
        // Define server's routes
        this.app.use(Router);

        // Final error middleware
        this.app.use(ErrorMiddleware);
    }

    public getApp() {
        return this.app;
    }

    public getServer() {
        return this.server;
    }

    public async start() {
        if (!this.server) new MissingServerError();

        // Listen to stop signals
        process.on('SIGTERM', () => this.stop('SIGTERM'));
        process.on('SIGINT', () => this.stop('SIGINT'));

        // Listen to HTTP traffic on given port
        this.server!.listen(PORT, async () => {
            logger.debug(`${APP_NAME} app listening on port: ${PORT}`);
        });
    }

    public async stop(signal: string = '') {
        if (!this.server) throw new MissingServerError();

        if (signal) {
            logger.warn(`Received stop signal: ${signal}`);
        }

        // Shut down gracefully
        await new Promise<void>((resolve, reject) => {
            this.server!.close((err) => {
                if (err) {
                    logger.fatal(`Could not shut down server gracefully: ${err}`);
                    reject(err);
                }

                logger.debug(`Server shut down gracefully.`);
                resolve();
            });
        });

        // Exit process
        process.exit(0);
    }
}

export default AppServer.getInstance();