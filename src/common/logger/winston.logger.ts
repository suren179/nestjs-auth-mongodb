import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import packageJSON from '../../../package.json';

function createWinstonLogger() {
	const logLevel = process.env.LOG_LEVEL || 'verbose';
	const logDirectory = process.env.LOG_DIR || './logs';
	const logFormat = winston.format.combine(
		winston.format.timestamp(),
		winston.format.ms(),
		nestWinstonModuleUtilities.format.nestLike(packageJSON.name, {
			colors: true,
			prettyPrint: true,
			processId: true,
			appName: true,
		}),
	);
	const fileLogFormat = winston.format.combine(
		winston.format.timestamp(),
		winston.format.ms(),
		nestWinstonModuleUtilities.format.nestLike(packageJSON.name, {
			colors: false,
			prettyPrint: true,
			processId: false,
			appName: true,
		}),
	);
	const consoleTransport = new winston.transports.Console({
		format: logFormat,
	});
	const debugLogFileTransport = new winston.transports.DailyRotateFile({
		filename: `${logDirectory}/debug-logs/debug-%DATE%.log`,
		datePattern: 'YYYY-MM-DD',
		maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
		format: fileLogFormat,
	});
	const errorLogFileTransport = new winston.transports.DailyRotateFile({
		filename: `${logDirectory}/error-logs/error-%DATE%.log`,
		datePattern: 'YYYY-MM-DD',
		maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
		format: fileLogFormat,
	});
	const loggerInstance = winston.createLogger({
		// options of Winston
		level: logLevel,
		transports: [consoleTransport, debugLogFileTransport],
		exceptionHandlers: [consoleTransport, errorLogFileTransport],
		rejectionHandlers: [consoleTransport, errorLogFileTransport],
		exitOnError: false,
	});

	return loggerInstance;
}

export const loggerInstance = createWinstonLogger();
