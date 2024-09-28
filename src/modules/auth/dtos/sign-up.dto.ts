import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
	@IsEmail()
	@ApiProperty({ example: 'john@example.com', description: 'Email' })
	email: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'John Doe', description: 'User Name' })
	name: string;

	@IsNotEmpty()
	@MinLength(8)
	@ApiProperty({ example: 'password123!', description: 'Password' })
	password: string;
}
