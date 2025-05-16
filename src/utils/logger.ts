import { createLogger, transports, format, Logger } from 'winston';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import fs, { unlinkSync } from 'fs';
import processEnvManager from '../manager/processEnv/processEnv.manager';
import path from 'path';
const config = require('config');

dayjs.extend(CustomParseFormat);
const currendDay = dayjs().format('YYYY_MM_DD');
const logFileName = currendDay + '.log';

/**
 * Scegliere quale formato vogliamo.
 */
export const logger = createLogger({
    // format: format.combine(format.timestamp(), format.prettyPrint()),
    format: format.combine(format.splat(), format.simple(), format.json(), format.colorize()),
    transports: [
        new transports.Console({
            level: processEnvManager.isDevelopment() ? 'info' : 'error',
        }),
        new transports.File({
            filename: config.get('logs.folder') + logFileName,
        }),
    ],
});

export function clearLogs(logger: Logger) {
    const firstDayToClear = dayjs().subtract(config.get('logs.daysToKeep'), 'day');
    const directoryPath = path.basename(config.get('logs.folder'));
    fs.readdir(directoryPath, function (err, files) {
        if (err) return;
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            const logName = path.parse(file).name;
            const logDay = dayjs(logName, 'YYYY_MM_DD');
            if (logDay.isBefore(firstDayToClear)) {
                unlinkSync(path.join(directoryPath, file));
            }
        });
        logger.info('[Info] Removed all Logs before ' + firstDayToClear.format('DD/MM/YYYY'));
    });
}
