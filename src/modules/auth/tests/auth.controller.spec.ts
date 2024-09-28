import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { Controller, Get, Logger } from '@nestjs/common';
class MockLogger {
	log() {}
	error() {}
	warn() {}
	debug() {}
	verbose() {}
}
describe('AuthController', () => {
	let authController: AuthController;
	let authService: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						signIn: jest.fn(),
						signUp: jest.fn(),
						refreshToken: jest.fn(),
					},
				},
				{
					provide: ConfigService,
					useValue: {},
				},
				{ provide: Logger, useClass: MockLogger },
			],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});

	describe('signIn', () => {
		it('should call signIn with correct parameters and response type', async () => {
			const signInDto: SignInDto = {
				email: 'test@example.com',
				password: 'password123',
			};
			const result = { accessToken: 'xxx', refreshToken: 'yyyy' };

			jest.spyOn(authService, 'signIn').mockResolvedValue(result);

			const response = await authController.signIn(signInDto);

			expect(authService.signIn).toHaveBeenCalledWith(signInDto);
			expect(response).toEqual(result);
		});
	});

	describe('signUp', () => {
		it('should call signUp with correct parameters and response type', async () => {
			const signUpDto: SignUpDto = {
				email: 'new@example.com',
				password: 'password123',
				name: 'John Doe',
			};
			const result = { accessToken: 'xxx', refreshToken: 'yyyy' };

			jest.spyOn(authService, 'signUp').mockResolvedValue(result);

			const response = await authController.signUp(signUpDto);

			expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
			expect(response).toEqual(result);
		});
	});

	describe('refreshToken', () => {
		it('should call refreshToken with correct parameters and response type', async () => {
			const refreshTokenDto: RefreshTokenDto = {
				refreshToken: 'some-refresh-token',
			};
			const result = { accessToken: 'xxx', refreshToken: 'yyyy' };

			jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

			const response = await authController.refreshToken(refreshTokenDto);

			expect(authService.refreshToken).toHaveBeenCalledWith(
				refreshTokenDto,
			);
			expect(response).toEqual(result);
		});
	});
});
