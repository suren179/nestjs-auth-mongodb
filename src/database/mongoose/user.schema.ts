import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
	@Prop({ required: true })
	@ApiProperty({ example: 'john@example.com', description: 'Email' })
	email: string;

	@Prop({ required: true })
	@ApiProperty({ example: 'password123!', description: 'Password' })
	password: string;

	@Prop({ required: true })
	@ApiProperty({ example: 'John Doe', description: 'User Name' })
	name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
