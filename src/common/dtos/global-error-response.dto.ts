import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GlobalErrorResponseDto {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ example: '400', description: 'Status Code' })
	statusCode: number;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example: 'BadRequestException',
		description: 'Error/Exception Type',
	})
	error: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example:
			'Some Error Message. Example: Invalid password Or User already Registered',
		description: 'Error/Exception Message',
	})
	message: string;
}
