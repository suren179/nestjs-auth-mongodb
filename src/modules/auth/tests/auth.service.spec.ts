import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../database/mongoose/user.schema';
import { Model } from 'mongoose';
import { Controller, Get, Logger } from '@nestjs/common';
class MockLogger {
	log() {}
	error() {}
	warn() {}
	debug() {}
	verbose() {}
}
import {
	NotFoundException,
	UnauthorizedException,
	ConflictException,
} from '@nestjs/common';

describe('AuthService', () => {
	let authService: AuthService;
	let userModel: Model<User>;
	let configService: ConfigService;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: getModelToken(User.name),
					useValue: {
						findOne: jest.fn(),
						save: jest.fn(),
					},
				},
				{ provide: ConfigService, useValue: { get: jest.fn() } },
				{
					provide: JwtService,
					useValue: { sign: jest.fn(), verifyAsync: jest.fn() },
				},
				{ provide: Logger, useClass: MockLogger },
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		userModel = module.get<Model<User>>(getModelToken(User.name));
		configService = module.get<ConfigService>(ConfigService);
		jwtService = module.get<JwtService>(JwtService);
	});

	describe('signIn', () => {
		it('should throw NotFoundException if user does not exist', async () => {
			jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

			await expect(
				authService.signIn({
					email: 'test@example.com',
					password: 'password123!!',
				}),
			).rejects.toThrow(NotFoundException);
		});

		it('should throw UnauthorizedException if password is incorrect', async () => {
			const mockUser = {
				email: 'test@example.com',
				password: 'hashedPassword',
			};
			jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
			jest.spyOn(authService, 'verifyPassword').mockResolvedValue(false);

			await expect(
				authService.signIn({
					email: 'test@example.com',
					password: 'wrongpassword',
				}),
			).rejects.toThrow(UnauthorizedException);
		});

		it('should return access and refresh tokens on valid sign in', async () => {
			const mockUser = {
				email: 'test@example.com',
				password: 'hashedPassword',
			};
			jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);
			jest.spyOn(authService, 'verifyPassword').mockResolvedValue(true);
			jest.spyOn(
				authService,
				//@ts-ignore
				'generateAccessAndRefreshToken',
				//@ts-ignore
			).mockReturnValue({
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			});

			const result = await authService.signIn({
				email: 'test@example.com',
				password: 'password123!!',
			});

			expect(result).toEqual({
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			});
		});
	});

	describe('signUp', () => {
		it('should throw ConflictException if user already exists', async () => {
			jest.spyOn(userModel, 'findOne').mockResolvedValue({});
			await expect(
				authService.signUp({
					email: 'test@example.com',
					password: 'password123!!!',
					name: 'John',
				}),
			).rejects.toThrow(ConflictException);
		});
	});

	describe('refreshToken', () => {
		it('should throw UnauthorizedException if refresh token is invalid', async () => {
			//@ts-ignore
			jest.spyOn(authService, 'validateRefreshToken').mockRejectedValue(
				new UnauthorizedException(),
			);

			await expect(
				authService.refreshToken({ refreshToken: 'invalid_token' }),
			).rejects.toThrow(UnauthorizedException);
		});

		it('should return new access token on valid refresh token', async () => {
			//@ts-ignore
			jest.spyOn(authService, 'validateRefreshToken').mockResolvedValue({
				email: 'test@example.com',
				sub: 'user_id',
			});
			jest.spyOn(jwtService, 'sign').mockReturnValue('new_access_token');

			const result = await authService.refreshToken({
				refreshToken: 'valid_token',
			});

			expect(result).toEqual({
				accessToken: 'new_access_token',
				refreshToken: 'valid_token',
			});
		});
	});
});
