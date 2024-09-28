// import {
// 	ExceptionFilter,
// 	Catch,
// 	ArgumentsHost,
// 	HttpException,
// 	HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';

// @Catch() // Catch all exceptions
// export class HttpExceptionFilter implements ExceptionFilter {
// 	catch(exception: unknown, host: ArgumentsHost) {
// 		const ctx = host.switchToHttp();
// 		const response = ctx.getResponse<Response>();

// 		let status: number;
// 		let message: string;

// 		if (exception instanceof HttpException) {
// 			// If it's an HttpException, get its status and response
// 			status = exception.getStatus();
// 			message =
// 				(exception.getResponse() as any).message || 'HTTP Exception';
// 		} else if (exception instanceof Error) {
// 			// If it's a normal Error, set a 500 status
// 			status = HttpStatus.INTERNAL_SERVER_ERROR;
// 			message = exception.message || 'Internal Server Error';
// 		} else {
// 			// For any other types, assume an internal server error
// 			status = HttpStatus.INTERNAL_SERVER_ERROR;
// 			message = 'Internal Server Error';
// 		}

// 		// Respond with a consistent error structure
// 		response.status(status).json({
// 			statusCode: status,
// 			message: message,
// 		});
// 	}
// }
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
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

		response.status(status).json({
			statusCode: status,
			error: exception.name,
			message: errorMessage,
		});
	}
}
