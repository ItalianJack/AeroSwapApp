const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const app = require('../app');

chai.use(chaiHttp);

// List of all paths that need to be tested
// GET /aircraft
// GET /aircraft/new
// POST /aircraft
// GET /aircraft/:id
// GET /aircraft/:id/edit
// PUT /aircraft/:id
// DELETE /aircraft/:id
// GET /users/new
// POST /users
// GET /users/login
// POST /users/login
// GET /users/profile
// GET /users/logout

// Session-insensitive tests
// GET /
// GET /aircraft
describe('Session-insensitive tests', () => {
    // GET / returns 200
    it('GET / returns 200', done => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
    // GET /aircraft returns 200
    it('GET /aircraft returns 200', done => {
        chai.request(app)
            .get('/aircraft')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
});

// Guest session tests
describe('Guest session tests', () => {
    // GET /users/login returns 200
    it('GET /users/login returns 200', done => {
        chai.request(app)
            .get('/users/login')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
    // GET /users/profile redirects to /users/login
    it('GET /users/profile redirects to /users/login', done => {
        chai.request(app)
            .get('/users/profile')
            .end((err, res) => {
                chai.expect(res).to.redirect;
                chai.expect(res).to.redirectTo('http://localhost:3000/users/login');
                done();
            });
    });
});


// Logged in session tests, use below credentials for these tests
// email: jkruege4@charlotte.edu, password: 12345678
describe('Logged-in session tests', () => {
    let agent = chai.request.agent(app);
    it('POST /users/login logs in', done => {
        agent
            .post('/users/login')
            .type('form')
            .send({email: 'jkruege4@charlotte.edu', password: '12345678'})
            .end((err, res) => {
                // Check if the response contains the string 'Welcome'
                chai.expect(res.text).to.contain('Welcome to AeroSwap');
                done();
            });
    });
    // GET /users/profile returns 200
    it('GET /users/profile returns 200', done => {
        agent
            .get('/users/profile')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
    // Listing with id 65f9f9a572bc0a4a44fdedb4 shows edit and delete buttons
    it('GET /aircraft/65f9f9a572bc0a4a44fdedb4 shows edit and delete buttons', done => {
        agent
            .get('/aircraft/65f9f9a572bc0a4a44fdedb4')
            .end((err, res) => {
                chai.expect(res.text).to.contain('Edit');
                chai.expect(res.text).to.contain('Delete');
                done();
            });
    });
    // Listing with id 65f9f9e772bc0a4a44fdedb6 does not show edit and delete buttons
    it('GET /aircraft/65f9f9e772bc0a4a44fdedb6 does not show edit and delete buttons', done => {
        agent
            .get('/aircraft/65f9f9e772bc0a4a44fdedb6')
            .end((err, res) => {
                chai.expect(res.text).to.not.contain('Edit');
                chai.expect(res.text).to.not.contain('Delete');
                done();
            });
    });
});
