import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config'; // Import database config
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
@Module({
	imports: [
		WinstonModule.forRootAsync({
			useFactory: () => ({
				// options
			}),
			inject: [],
		}),
		ConfigModule.forRoot({
			load: [appConfig, jwtConfig, databaseConfig], // Load the configuration files
			isGlobal: true, // Make the config globally available
		}),
		MongooseModule.forRootAsync({
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('database.uri'), // Get DB URI from config
			}),
			inject: [ConfigService], // Inject ConfigService to access configuration
		}),
		AuthModule,
		UserModule,
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => [
				{
					ttl: configService.get<number>('THROTTLE_TTL') || 60000,
					limit: configService.get<number>('THROTTLE_LIMIT') || 20,
				},
			],
		}),
	],
	controllers: [AppController],
	providers: [
		Logger,
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
