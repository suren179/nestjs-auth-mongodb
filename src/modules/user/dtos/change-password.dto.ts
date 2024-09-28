import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'password123!', description: 'Old Password' })
	oldPassword: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'password123!2', description: 'New Password' })
	newPassword: string;
}
