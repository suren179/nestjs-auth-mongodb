import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../database/mongoose/user.schema';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		AuthModule,
	],
	providers: [UserService, JwtStrategy],
	controllers: [UserController],
})
export class UserModule {}
