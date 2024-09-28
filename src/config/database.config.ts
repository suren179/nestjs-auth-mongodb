import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
	uri: process.env.MONGODB_URL || 'mongodb://localhost:27017/nest',
}));
