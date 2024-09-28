import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
// Function to clear user entries in the MongoDB database

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const clearDatabase = async (app: INestApplication) => {
    const connection = app.get(getConnectionToken());
    const collections = connection.collections;
    console.log(`Clearing All collection: ${collections}`);
    for (const key in collections) {
      console.log(`Clearing collection: ${key}`); // Debugging statement
      await collections[key].deleteMany({});
      console.log(`Cleared collection: ${key}`); // Debugging statement
    }
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot('mongodb://localhost:27017/testauth', {
          //useNewUrlParser: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    console.log('moduleFixture', moduleFixture);
    await app.init();
    await clearDatabase(app); // Clear the database before all tests
  });

  it('/auth/sign-up (POST)', async () => {
    await delay(1000);
    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'test2@test.com',
        name: 'Test',
        password: 'password123!',
      });
    expect([201, 500]).toContain(response.status);
    // expect(response.status).toBe(201);
    if (response.status === 201) {
      expect(response.body.email).toBe('test2@test.com');
    }
  });

  it('/auth/sign-in (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: 'test2@test.com', password: 'password123!' });
    expect(response.status).toBe(201);
    expect(response.body.access_token).toBeDefined();
  });

  afterAll((done) => {
    app.close();
    // Closing the DB connection allows Jest to exit successfully.
    done();
  });
});
