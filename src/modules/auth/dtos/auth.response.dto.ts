import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'xxx', description: 'Access Token' })
	accessToken: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'xxx', description: 'Refresh Token' })
	refreshToken: string;
}
