import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponse {
	@IsEmail()
	@ApiProperty({ example: 'john@example.com', description: 'Email' })
	email: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'John Doe', description: 'User Name' })
	name: string;
}
