// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from './auth/auth.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// // import { RateLimiterModule } from 'nestjs-rate-limiter';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true, // Make ConfigModule global so it can be used anywhere in the app
//       envFilePath: '.env', // Specify the .env file to load
//     }),
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         uri: configService.get<string>('MONGODB_URL'), // Load DB URL from .env
//       }),
//     }),
//     AuthModule,
//     // RateLimiterModule.registerAsync({
//     //   imports: [ConfigModule],
//     //   inject: [ConfigService],
//     //   useFactory: (configService: ConfigService) => ({
//     //     points: configService.get<number>('RATE_LIMIT_MAX_REQUESTS'), // Max requests from .env
//     //     duration: configService.get<number>('RATE_LIMIT_WINDOW_MS') / 1000, // Duration from .env (convert from ms to seconds)
//     //   }),
//     // }),
//   ],
// })
// export class AppModule {}

// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';
// import { JwtStrategy } from './modules/auth/jwt.strategy';
// import appConfig from './config/app.config';
// import jwtConfig from './config/jwt.config';
// import databaseConfig from './config/database.config';

// @Module({
// 	imports: [
// 		ConfigModule.forRoot({
// 			load: [appConfig, jwtConfig, databaseConfig],
// 			isGlobal: true,
// 		}),
// 		MongooseModule.forRoot(process.env.DATABASE_URL),
// 		AuthModule,
// 		UsersModule,
// 	],
// 	providers: [JwtStrategy],
// })
// export class AppModule {}

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
