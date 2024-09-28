import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessMessageResponseDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example: 'Some Success Message. Example: Password Changed Successfully',
		description: 'Success Message',
	})
	message: string;
}
