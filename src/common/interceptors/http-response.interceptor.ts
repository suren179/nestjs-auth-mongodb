import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const response = context.switchToHttp().getResponse();

		return next.handle().pipe(
			map((data) => {
				// Set the status code based on your conditions
				const statusCode = response.statusCode; // Get the status code
				return {
					statusCode,
					data,
				};
			}),
		);
	}
}
