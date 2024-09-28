import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
	accessToken: {
		secret: process.env.JWT_ACCESS_TOKEN_SECRET,
		expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
	},
	refreshToken: {
		secret: process.env.JWT_REFRESH_TOEKN_SECRET,
		expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
	},
}));
