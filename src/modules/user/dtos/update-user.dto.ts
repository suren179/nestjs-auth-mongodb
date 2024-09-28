import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'John Doe', description: 'User Name' })
	name: string;
}
