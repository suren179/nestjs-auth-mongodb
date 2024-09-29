import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../database/mongoose/user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserInfoResponse } from './dtos/user-info.response.dto';
import { SuccessMessageResponseDto } from 'src/common/dtos/success-message-response.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private userModel: Model<User>,
		private authService: AuthService,
	) {}

	async createUser(email: string, password: string) {
		const newUser = new this.userModel({ email, password });
		return newUser.save();
	}

	// async findAllUsers() {
	// 	return this.userModel.find().select('-password').exec();
	// }
	async getUserById(id: string): Promise<UserInfoResponse> {
		return this.userModel.findById(id).select('-password').exec();
	}

	async updateUser(
		id: string,
		updateUser: UpdateUserDto,
	): Promise<UserInfoResponse> {
		const user = await this.userModel.findByIdAndUpdate(
			id,
			{ $set: updateUser }, // Use $set to only update the fields provided
			{ new: true, select: '-password', runValidators: true }, // new: true as we need latest data
		);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async changePassword(
		id: string,
		changePassword: ChangePasswordDto,
	): Promise<SuccessMessageResponseDto> {
		if (changePassword.newPassword === changePassword.oldPassword) {
			throw new BadRequestException('New password is same as old one');
		}
		if (this.authService.validatePassword(changePassword.newPassword)) {
			const user = await this.userModel.findById(id).select('password');
			if (!user || !user.password) {
				throw new NotFoundException('User not found');
			}
			const isOldPasswordValid = await this.authService.verifyPassword(
				changePassword.oldPassword,
				user.password,
			);

			if (!isOldPasswordValid) {
				throw new BadRequestException('Wrong Old Password');
			}

			const hashedNewPassword =
				await this.authService.convertToHashPassword(
					changePassword.newPassword,
					10,
				);

			await this.userModel.findByIdAndUpdate(
				id,
				{ password: hashedNewPassword },
				{ new: false }, // new: false as we don't need updated document after update
			);
			return {
				message: 'Password changed successfully',
			};
		}
	}
}
