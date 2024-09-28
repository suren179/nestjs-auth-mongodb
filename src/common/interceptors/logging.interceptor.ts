import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const { method, url } = request;
		Logger.log(`Incoming Request: ${method} ${url}`);

		return next
			.handle()
			.pipe(tap(() => Logger.log(`Completed Request: ${method} ${url}`)));
	}
}
