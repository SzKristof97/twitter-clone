jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(() => ({ userId: '6756ed1b0d0a584bceb24949' })),
}));
