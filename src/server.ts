import app from './app';
import { createConnection } from './db';
import { logger, clearLogs } from './utils/logger';

createConnection();

app.listen(app.get('port'), () => {
    logger.info('Server on port: ' + app.get('port'));
    clearLogs(logger);
});
