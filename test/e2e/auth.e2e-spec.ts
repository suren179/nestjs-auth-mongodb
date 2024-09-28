import request from 'supertest';

describe('AuthController (e2e)', () => {
	describe('POST /auth/sign-up', () => {
		it('should successfully sign up a new user', async () => {
			const signUpDto = {
				email: 'test1@example.com',
				password: 'password123!',
				name: 'John Doe',
			};

			const response = await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(201);

			expect(response.body).toHaveProperty('accessToken');
		});

		it('should return 409 if the user is already registered', async () => {
			const signUpDto = {
				email: 'test2@example.com',
				password: 'password123!',
				name: 'John Doe',
			};

			// First registration should succeed
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(201);

			// Second registration should return conflict
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(409);
		});

		it('should return 400 if data validation fails. i.e. either email, password or name is not present', async () => {
			const signUpDto = {
				email: 'test3@example.com',
				password: 'Password123!',
				name: 'John Doe',
			};

			delete signUpDto.email;
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(400);

			signUpDto.email = 'test00@example.com';
			delete signUpDto.password;
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(400);

			signUpDto.name = 'John Doe';
			signUpDto.password = 'Password123!';
			delete signUpDto.name;
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(400);
		});
		it('should return 400 if the password too short', async () => {
			const signUpDto = {
				email: 'test3@example.com',
				password: 'abc',
				name: 'John Doe',
			};
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(400);
		});
		it(`should return 400 if the password doesn't have symbol`, async () => {
			const signUpDto = {
				email: 'test3@example.com',
				password: 'password1233456',
				name: 'John Doe',
			};
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(400);
		});
		it(`should return 400 if the password doesn't have letter`, async () => {
			const signUpDto = {
				email: 'test3@example.com',
				password: '12343534534!',
				name: 'John Doe',
			};
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(400);
		});
		it(`should return 400 if the password doesn't have number`, async () => {
			const signUpDto = {
				email: 'test3@example.com',
				password: 'passwordPassword!',
				name: 'John Doe',
			};
			await request(global.testApp.getHttpServer())
				.post('/auth/sign-up')
				.send(signUpDto)
				.expect(400);
		});
	});
});
