import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: 'xxx', description: 'Refresh Token' })
	refreshToken: string;
}
