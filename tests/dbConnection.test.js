require('dotenv').config();
const mongoose = require('mongoose');

describe('Database Connection', () => {
    beforeAll(async () => {
        // Replace with your test database URI
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should connect to the database successfully', async () => {
        expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });
});
