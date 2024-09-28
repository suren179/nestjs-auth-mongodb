import request from 'supertest';

const signUpAndGetAccessToken = async (signUpDto) => {
	const response = await request(global.testApp.getHttpServer())
		.post('/auth/sign-up')
		.send(signUpDto)
		.expect(201);

	expect(response.body).toHaveProperty('accessToken');
	return response.body.accessToken;
};

describe('UserController (e2e)', () => {
	let defaultUserAccessToken;
	const defaultUserSignUpDto = {
		email: 'sharedUser@example.com',
		password: 'password123!',
		name: 'John Doe',
	};
	beforeAll(async () => {
		// Sign up once and get the access token
		defaultUserAccessToken =
			await signUpAndGetAccessToken(defaultUserSignUpDto);
	});

	describe('Get /users', () => {
		it('should successfully return user info', async () => {
			const signUpDto = {
				email: 'test1@example.com',
				password: 'password123!',
				name: 'John Doe',
			};
			const accessToken = await signUpAndGetAccessToken(signUpDto);
			// Second request to get user info using the access token
			const userInfoResponse = await request(
				global.testApp.getHttpServer(),
			)
				.get('/users/me')
				.set('Authorization', `Bearer ${accessToken}`) // Set the Authorization header
				.expect(200);

			expect(userInfoResponse.body).toHaveProperty(
				'email',
				signUpDto.email,
			);
			expect(userInfoResponse.body).toHaveProperty(
				'name',
				signUpDto.name,
			);
		});
	});

	describe('PUT /users/me', () => {
		it('should update user information', async () => {
			const updateUserDto = {
				name: 'Jane Doe123',
			};

			const response = await request(global.testApp.getHttpServer())
				.put('/users/me')
				.set('Authorization', `Bearer ${defaultUserAccessToken}`)
				.send(updateUserDto)
				.expect(200);
			expect(response.body).toHaveProperty('name', 'Jane Doe123');
		});
	});

	describe('POST /users/change-password', () => {
		it('should update user password and use new password to signin', async () => {
			const changePassword = {
				oldPassword: 'password123!',
				newPassword: 'password123!1234567',
			};

			await request(global.testApp.getHttpServer())
				.post('/users/me/change-password')
				.set('Authorization', `Bearer ${defaultUserAccessToken}`)
				.send(changePassword)
				.expect(200);

			const signInObj = {
				email: defaultUserSignUpDto.email,
				password: changePassword.newPassword,
			};
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-in')
				.send(signInObj)
				.expect(200);
		});
	});
});
