import {
	Controller,
	Post,
	Body,
	UseGuards,
	Request,
	HttpCode,
	Get,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/auth.response.dto';
import { GlobalErrorResponseDto } from '../../common/dtos/global-error-response.dto';
import { SuccessMessageResponseDto } from '../../common/dtos/success-message-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	//Accept max 5 requests per 15 minutes
	//@Throttle({ default: { limit: 5, ttl: 900000 } })
	@Post('sign-in')
	@HttpCode(200)
	@ApiOperation({ summary: 'Sign In' })
	@ApiBody({
		type: SignInDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Successful login',
		type: AuthResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Invalid password',
		type: GlobalErrorResponseDto,
	})
	async signIn(@Body() loginDto: SignInDto) {
		return this.authService.signIn(loginDto);
	}

	//Accept max 5 requests per 15 minutes
	//@Throttle({ default: { limit: 5, ttl: 900000 } })
	@Post('sign-up')
	@HttpCode(201)
	@ApiOperation({ summary: 'Sign Up' })
	@ApiBody({
		type: SignUpDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Successful SignUp',
		type: AuthResponseDto,
	})
	@ApiResponse({
		status: 409,
		description: 'User already registered',
		type: GlobalErrorResponseDto,
	})
	async signUp(@Body() registerDto: SignUpDto): Promise<AuthResponseDto> {
		return this.authService.signUp(registerDto);
	}

	//Accept max 5 requests per 15 minutes
	//@Throttle({ default: { limit: 5, ttl: 900000 } })
	@Post('refresh-token')
	@HttpCode(200)
	@ApiOperation({ summary: 'Get Access Token From Refresh Token' })
	@ApiBody({
		type: RefreshTokenDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully Generated Access Token From Refresh Token',
		type: AuthResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'Refresh Token Expired',
		type: GlobalErrorResponseDto,
	})
	async refreshToken(
		@Body() refreshTokenDto: RefreshTokenDto,
	): Promise<AuthResponseDto> {
		return this.authService.refreshToken(refreshTokenDto);
	}

	@Get('')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Verify User Authentication (If token is valid)' })
	@ApiBody({
		type: RefreshTokenDto,
	})
	@ApiResponse({
		status: 200,
		description: 'User Is Authenticated',
		type: SuccessMessageResponseDto,
	})
	@ApiResponse({
		status: 401,
		description: 'User Is Not Authenticated',
		type: GlobalErrorResponseDto,
	})
	async auth(): Promise<SuccessMessageResponseDto> {
		return {
			message: 'User Is Authenticated',
		};
	}
}
