import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
	@IsEmail()
	@ApiProperty({ example: 'john@example.com', description: 'Email' })
	email: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'password123!', description: 'Password' })
	password: string;
}
