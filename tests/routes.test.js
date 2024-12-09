const request = require('supertest');
const app = require('../index'); // Import your app entry point
const mongoose = require('mongoose');

describe('Routes and Middleware', () => {
    beforeAll(async () => {
        // Replace with your test database URI
        const dbURI = process.env.MONGO_URI_TEST;
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('Protected Routes', () => {
        it('should return 401 for unauthorized access to POST /tweets', async () => {
            const response = await request(app)
                .post('/tweets')
                .send({ content: 'Unauthorized test tweet' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Access denied. No token provided.');
        });

        it('should allow access to POST /tweets with valid token', async () => {
            const response = await request(app)
                .post('/tweets')
                .set('Authorization', `Bearer valid_mock_token`)
                .send({ content: 'Authorized test tweet' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Tweet created successfully');
        });
    });
});
