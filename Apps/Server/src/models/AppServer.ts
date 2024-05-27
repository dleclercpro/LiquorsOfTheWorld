import http from 'http';
import express, { Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import ErrorMiddleware from '../middleware/ErrorMiddleware';
import TimeDuration from './units/TimeDuration';
import { killAfterTimeout } from '../utils/process';
import { Socket } from 'net';
import { DEV, TEST, PROD, CLIENT_ROOT, PORT } from '../config';
import logger from '../logger';
import { TimeUnit } from '../types';



// There can only be one app server: singleton!
class AppServer {
    private app?: express.Express;
    private server?: http.Server;
    private connections: Set<Socket> = new Set();

    public async setup(router: Router) {
        this.app = express();
        this.server = http.createServer(this.app);
    
        // Enable use of cookies
        this.app.use(cookieParser());
    
        // Enable use of JSON data
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    
        // Enable HTTP response compression
        this.app.use(compression());

        // CORS
        if (DEV || TEST) {
            const CORS_OPTIONS = {
                origin: CLIENT_ROOT,
                credentials: true,
            };

            this.app.use(cors(CORS_OPTIONS));
            logger.debug(`CORS enabled: [${CORS_OPTIONS.origin}]`);
        }

        // Define server's API endpoints
        this.app.use('/', router);

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
        if (!this.server) throw new Error('MISSING_SERVER');

        // Listen to stop signals
        process.on('SIGTERM', () => this.stop('SIGTERM'));
        process.on('SIGINT', () => this.stop('SIGINT'));

        // Track active connections
        this.server.on('connection', (conn) => {
            this.connections.add(conn);
            conn.on('close', () => this.connections.delete(conn));
        });

        // Listen to HTTP traffic on given port
        this.server!.listen(PORT, async () => {
            logger.debug(`Server listening on ${PROD ? 'container' : 'local'} port: ${PORT}`);
        });
    }

    public async stop(signal: string = '', timeout: TimeDuration = new TimeDuration(30, TimeUnit.Second)) {
        if (!this.server) throw new Error('MISSING_SERVER');

        if (signal) {
            logger.trace(`Received stop signal: ${signal}`);
        }

        // Force server shutdown after timeout
        await Promise.race([killAfterTimeout(timeout), (async () => {
            
            // Shut down gracefully
            await new Promise<void>((resolve, reject) => {
                logger.debug(`Closing active ${this.connections.size} connections...`);
                this.connections.forEach(conn => conn.destroy());

                logger.debug(`Shutting down server...`);
                this.server!.close((err) => {
                    if (err) {
                        logger.warn(`Could not shut down server gracefully: ${err}`);
                        reject(err);
                    }

                    logger.debug(`Server shut down gracefully.`);
                    resolve();
                });
            });

            // Exit process
            logger.debug(`Exiting process...`);
            process.exit(0);

        })()]);
    }
}

export default AppServer;