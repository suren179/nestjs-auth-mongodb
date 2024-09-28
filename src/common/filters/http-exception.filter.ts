import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		const errorMessage =
			typeof exception.getResponse() === 'string'
				? exception.getResponse()
				: exception['message'] || 'Internal Server Error';

		Logger.error(
			`HttpException: ${exception}. ErrorMessage: ${errorMessage}`,
		);
		response.status(status).json({
			statusCode: status,
			error: exception.name,
			message: errorMessage,
		});
	}
}
