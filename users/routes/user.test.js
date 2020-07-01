
const app = require('../server');

const supertest = require('supertest');
const request = supertest(app);

it('Testing to see if Jest works', async done => {
    expect(1).toBe(1);
    done();
});