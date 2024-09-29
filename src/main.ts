import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { loggerInstance } from './common/logger/winston.logger';
import { ConfigService } from '@nestjs/config';
// import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';
import { readFileSync } from 'fs';

function createSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Auth Nestjs App')
		.setDescription('Auth Nestjs App')
		.setVersion('0.1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
	try {
		let app;
		if (process.env.ENABLE_HTTPS === 'true') {
			const httpsOptions = {
				key: readFileSync('./ssl-certs/private-key.pem'), // Adjust the path
				cert: readFileSync('./ssl-certs/public-certificate.pem'), // Adjust the path
			};
			console.log('Https enabled');
			// Create HTTPS server
			app = await NestFactory.create(AppModule, {
				logger: WinstonModule.createLogger({
					instance: loggerInstance,
				}),
				httpsOptions,
			});
		} else {
			console.log('Https Not Enabled');
			app = await NestFactory.create(AppModule, {
				logger: WinstonModule.createLogger({
					instance: loggerInstance,
				}),
			});
		}

		// const app = await NestFactory.create(AppModule, {
		// 	logger: WinstonModule.createLogger({
		// 		instance: loggerInstance,
		// 	}),
		// });

		// Security middlewares
		app.use(
			helmet({
				contentSecurityPolicy: {
					directives: {
						defaultSrc: ["'self'"],
						scriptSrc: ["'self'", process.env.CORS_ORIGIN], // Allow scripts from trusted CDN
						objectSrc: ["'none'"], // Disallow all object sources
						upgradeInsecureRequests: [], // Automatically upgrade HTTP to HTTPS (enable it if using ENABLE_HTTPS as true)
					},
				},
				frameguard: { action: 'sameorigin' }, /// (X-Frame-Options)
				xssFilter: true, // Enable XSS filtering (X-XSS-Protection: Depreciated In Chrome)
				crossOriginResourcePolicy: { policy: 'same-origin' },
				referrerPolicy: { policy: 'no-referrer' },
				hsts: {
					maxAge: 31536000, // Enforce HSTS for 1 year
					includeSubDomains: true,
				},
			}),
		);

		app.enableCors({
			origin: process.env.CORS_ORIGIN, // CORS origin from .env
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			credentials: true,
		});
		app.useGlobalInterceptors(new LoggingInterceptor());
		//Removing this as there is no use of this (future)
		// app.useGlobalInterceptors(new HttpResponseInterceptor());
		app.useGlobalFilters(new HttpExceptionFilter());
		app.useGlobalPipes(new ValidationPipe());

		createSwagger(app);

		await app.listen(process.env.PORT);

		loggerInstance.log(
			'info',
			`Application is running on: ${await app.getUrl()}`,
		);
	} catch (e) {
		console.error(e);
	}
}
bootstrap();
