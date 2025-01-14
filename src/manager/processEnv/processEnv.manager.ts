import { nodeEnv } from './envEnum';
const config = require('config');

export default class processEnvManager {
    public static isDevelopment(): boolean {
        const currentEnv: string = process.env.NODE_ENV || '';

        return currentEnv === nodeEnv.DEVELOP;
    }

    public static getWebSocketPort(): number {
        return process.env.WEB_SOCKET_PORT ? +process.env.WEB_SOCKET_PORT : 8080;
    }
    public static getLocalDatabasePort(): number {
        return process.env.LOCAL_DATABASE_PORT ? +process.env.LOCAL_DATABASE_PORT : 4201;
    }

    public static getRequestExpirationDate(): number {
        const fallbackDay = 60 * 60 * 24;
        return Math.round((process.env.EXPIRATION_TIME ? +process.env.EXPIRATION_TIME : fallbackDay) * 1000);
    }

    public static getBaseDirectory(): string {
        return process.env.LOCAL_DATABASE_DIR || config.get('localDatabase.folder');
    }
}
