const mongoose = require('mongoose');

describe('Database Connection', () => {
    beforeAll(async () => {
        // Replace with your test database URI
        const dbURI = 'mongodb://localhost:27017/twitter_clone';
        await mongoose.connect(dbURI, {
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
