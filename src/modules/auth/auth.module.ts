import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../database/mongoose/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('jwt.accessToken.secret'),
				signOptions: {
					expiresIn: configService.get<string>(
						'jwt.accessToken.expiresIn',
					),
				},
			}),
			inject: [ConfigService],
		}),
		ConfigModule,
	],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
