import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../../src/modules/auth/auth.module'; // Import your Auth module
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'; // For in-memory MongoDB
import request from 'supertest';
import { JwtStrategy } from '../../src/modules/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '../../src/common/pipes/validation.pipe';
import { UserModule } from '../../src/modules/user/user.module';
import appConfig from '../../src/config/app.config';
import jwtConfig from '../../src/config/jwt.config';

let app: INestApplication;
let mongod: MongoMemoryServer;

beforeAll(async () => {
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri(); // Get the in-memory MongoDB URI

	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({
				load: [appConfig, jwtConfig], // Load the configuration files
				isGlobal: true, // Make the config globally available
			}),
			AuthModule, // Import the actual AuthModule
			UserModule,
			ConfigModule.forRoot(), // Import config (not used)
			MongooseModule.forRoot(uri), // Connect to in-memory MongoDB
		],
		providers: [JwtStrategy],
	}).compile();

	app = moduleFixture.createNestApplication();
	app.useGlobalPipes(new ValidationPipe());
	await app.init(); // Initialize the app
	// Expose app globally. It is needed for requests
	global.testApp = app;
});

afterAll(async () => {
	await app.close();
	await mongod.stop();
});
