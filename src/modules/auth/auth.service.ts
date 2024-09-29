import {
	Injectable,
	UnauthorizedException,
	BadRequestException,
	NotFoundException,
	ConflictException,
	Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from '../../database/mongoose/user.schema';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import * as bcrypt from 'bcryptjs';
import { AuthResponseDto } from './dtos/auth.response.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async convertToHashPassword(
		password: string,
		saltRounds: number = 10,
	): Promise<string> {
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	}

	async verifyPassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	validatePassword(password: string): boolean {
		const minLength = password.length >= 8;
		const hasLetter = /[A-Za-z]/.test(password); // At least one letter
		const hasNumber = /\d/.test(password); // At least one number
		const hasSpecialChar = /[@$!%*?&]/.test(password); // At least one special character

		const isValid = minLength && hasLetter && hasNumber && hasSpecialChar;
		if (!isValid) {
			throw new BadRequestException(
				'Password does not meet the requirements.',
			);
		} else {
			return true;
		}
	}

	private generateAccessToken(payload: any) {
		return this.jwtService.sign(payload, {
			expiresIn:
				this.configService.get<string>('jwt.accessToken.expiresIn') ||
				'2m',
			secret:
				this.configService.get<string>('jwt.accessToken.secret') ||
				'test-key',
		});
	}

	private generateRefreshToken(payload: any) {
		return this.jwtService.sign(payload, {
			expiresIn:
				this.configService.get<string>('jwt.refreshToken.expiresIn') ||
				'2m',
			secret:
				this.configService.get<string>('jwt.refreshToken.secret') ||
				'test-key', // Use a different secret for refresh token
		});
	}
	private generateAccessAndRefreshToken(user: User): AuthResponseDto {
		const payload = { email: user.email, sub: user._id };
		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);
		return {
			accessToken,
			refreshToken,
		};
	}

	private async validateRefreshToken(refreshToken: string): Promise<any> {
		try {
			const jwtPayload = await this.jwtService.verifyAsync(refreshToken, {
				secret:
					this.configService.get<string>('jwt.refreshToken.secret') ||
					'test-key',
			});
			return {
				email: jwtPayload.email,
				sub: jwtPayload.sub,
			};
		} catch (error) {
			Logger.error(error);
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	async signIn(loginDto: SignInDto): Promise<AuthResponseDto> {
		const user = await this.userModel.findOne({
			email: loginDto.email,
		});

		if (!user) {
			throw new NotFoundException('User not registered');
		}
		if (!(await this.verifyPassword(loginDto.password, user.password))) {
			throw new UnauthorizedException('Invalid password');
		}
		return this.generateAccessAndRefreshToken(user);
	}

	async refreshToken(
		refreshTokenDto: RefreshTokenDto,
	): Promise<AuthResponseDto> {
		try {
			const payload = await this.validateRefreshToken(
				refreshTokenDto.refreshToken,
			);
			//Only generate accessToken (not refresh token)
			const accessToken = this.jwtService.sign(payload);

			return {
				accessToken: accessToken,
				refreshToken: refreshTokenDto.refreshToken,
			};
		} catch (e) {
			Logger.error(e);
			throw new UnauthorizedException();
		}
	}

	async signUp(registerDto: SignUpDto): Promise<AuthResponseDto> {
		const { password } = registerDto;
		if (this.validatePassword(password)) {
			const user = await this.userModel.findOne({
				email: registerDto.email,
			});

			if (user) {
				throw new ConflictException('User already registered');
			}
			const hashedPassword = await this.convertToHashPassword(
				password,
				10,
			);
			registerDto.password = hashedPassword;
			const newUser = new this.userModel(registerDto);
			await newUser.save();

			return this.generateAccessAndRefreshToken(newUser);
		}
	}
}
