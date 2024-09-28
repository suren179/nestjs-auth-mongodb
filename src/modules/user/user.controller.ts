import {
	Controller,
	Get,
	Put,
	Body,
	Request,
	UseGuards,
	HttpCode,
	Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserInfoResponse } from './dtos/user-info.response.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { SuccessMessageResponseDto } from 'src/common/dtos/success-message-response.dto';
import { GlobalErrorResponseDto } from 'src/common/dtos/global-error-response.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@ApiOperation({ summary: 'Get User Information' })
	@ApiResponse({
		status: 200,
		description: 'User Information',
		type: UserInfoResponse,
	})
	async getUser(@Request() req): Promise<UserInfoResponse> {
		// The userId was set in the JwtStrategy
		return this.userService.getUserById(req.user.userId);
	}

	@Put('me')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@ApiOperation({ summary: 'Update User Information' })
	@ApiResponse({
		status: 200,
		description: 'Update User Information',
		type: UserInfoResponse,
	})
	async updateUser(@Request() req, @Body() updateUser: UserInfoResponse) {
		// The userId was set in the JwtStrategy
		return this.userService.updateUser(req.user.userId, updateUser);
	}

	@Get('')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get All Users' })
	@HttpCode(200)
	async getAllUser() {
		return this.userService.findAllUsers();
	}

	@UseGuards(JwtAuthGuard)
	@Post('/me/change-password')
	@HttpCode(200)
	@ApiOperation({ summary: 'Change Password' })
	@ApiBody({
		type: ChangePasswordDto,
	})
	@ApiResponse({
		status: 200,
		description: 'Password changed successfully',
		type: SuccessMessageResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'New password is same as old one',
		type: GlobalErrorResponseDto,
	})
	async changePassword(
		@Request() req,
		@Body() changePassword: ChangePasswordDto,
	) {
		// The userId was set in the JwtStrategy
		return this.userService.changePassword(req.user.userId, changePassword);
	}
}
