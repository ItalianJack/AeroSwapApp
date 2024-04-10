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
describe('Anyone', function () {
    describe('Can', () => {
        // GET / returns 200
        it('Access the home page', done => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
        // GET /aircraft returns 200
        it('See listings', done => {
            chai.request(app)
                .get('/aircraft')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
        // Searching aircraft returns 200
        it('Search listings', done => {
            chai.request(app)
                .get('/aircraft?search=')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
        // Viewing aircraft returns 200
        it('View a listing', done => {
            chai.request(app)
                .get('/aircraft/65f9f9a572bc0a4a44fdedb4')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
    });
});

// Guest session tests
describe('Guests', () => {
    describe('Can', () => {
        // Access registration page
        it('Access registration page', done => {
            chai.request(app)
                .get('/users/new')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
        // Register an account
        it('Register an account', done => {
            chai.request(app)
                .post('/users')
                .type('form')
                .send({
                    email: 'jdoe@gmail.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    password: '12345678'
                })
                .end((err, res) => {
                    // expect a redirect to the login page
                    chai.expect(res).to.redirect;
                    chai.expect(res.redirects[0]).to.contain('/users/login');
                    done();
                })
        });
        // Access login page
        it('Access login page', done => {
            chai.request(app)
                .get('/users/login')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
    });
    describe('Cannot', () => {
        // GET /users/profile redirects to /users/login
        it('Access profile page', done => {
            chai.request(app)
                .get('/users/profile')
                .end((err, res) => {
                    chai.expect(res).to.redirect;
                    chai.expect(res.redirects[0]).to.contain('/users/login');
                    done();
                });
        });
        // Access new listing page
        it('Access new listing page', done => {
            chai.request(app)
                .get('/aircraft/new')
                .end((err, res) => {
                    chai.expect(res).to.redirect;
                    chai.expect(res.redirects[0]).to.contain('/users/login');
                    done();
                });
        });
        // Create a new listing
        it('Create a new listing', done => {
            chai.request(app)
                .post('/aircraft')
                .type('form')
                .send({
                    title: 'Test Listing',
                    description: 'This is a test listing',
                    price: 100000,
                    location: 'Charlotte, NC'
                })
                .end((err, res) => {
                    chai.expect(res).to.redirect;
                    chai.expect(res.text).to.contain('Login');
                    done();
                });
        });
        // Access edit listing page
        it('Access edit listing page', done => {
            chai.request(app)
                .get('/aircraft/65f9f9a572bc0a4a44fdedb4/edit')
                .end((err, res) => {
                    chai.expect(res).to.redirect;
                    chai.expect(res.redirects[0]).to.contain('/users/login');
                    done();
                });
        });
        // Edit a listing
        it('Edit a listing', done => {
            chai.request(app)
                .put('/aircraft/65f9f9a572bc0a4a44fdedb4')
                .type('form')
                .send({
                    title: 'Test Listing',
                    description: 'This is a test listing',
                    price: 100000,
                    location: 'Charlotte, NC'
                })
                .end((err, res) => {
                    chai.expect(res).to.redirect;
                    chai.expect(res.redirects[0]).to.contain('/users/login');
                    done();
                });
        });
        // Logout
        it('Logout', done => {
            chai.request(app)
                .get('/users/logout')
                .end((err, res) => {
                    chai.expect(res).to.redirect;
                    chai.expect(res.redirects[0]).to.contain('/users/login');
                    done();
                });
        });
    });
});


// Logged-in session tests, use below credentials for these tests
// email: jkruege4@charlotte.edu, password: 12345678
describe('Logged in users', () => {
    let agent = chai.request.agent(app);
    describe('Can', () => {
        it('Login', done => {
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
        it('View their profiles', done => {
            agent
                .get('/users/profile')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
        // Listing with id 65f9f9a572bc0a4a44fdedb4 shows edit and delete buttons
        it('See edit and delete buttons for his own listing', done => {
            agent
                .get('/aircraft/65f9f9a572bc0a4a44fdedb4')
                .end((err, res) => {
                    chai.expect(res.text).to.contain('Edit');
                    chai.expect(res.text).to.contain('Delete');
                    done();
                });
        });
        // View edit page for his own listing
        it('Access edit page for his own listing', done => {
            agent
                .get('/aircraft/65f9f9a572bc0a4a44fdedb4/edit')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
        // Edit his own listing
        it('Edit his own listing', done => {
            agent
                .put('/aircraft/65f9f9a572bc0a4a44fdedb4')
                .type('form')
                .field('title', 'Test Listing')
                .field('details', 'This is a test listing')
                .field('price', 100000)
                .field('condition', 'New')
                .end((err, res) => {
                    chai.expect(res).to.redirect;
                    chai.expect(res.redirects[0]).to.contain('/aircraft/65f9f9a572bc0a4a44fdedb4');
                    done();
                });
        });
    });
    describe('Cannot', () => {
        // Listing with id 65f9f9e772bc0a4a44fdedb6 does not show edit and delete buttons
        it('See edit and delete buttons for someone else\'s listing', done => {
            agent
                .get('/aircraft/65f9f9e772bc0a4a44fdedb6')
                .end((err, res) => {
                    chai.expect(res.text).to.not.contain('Edit');
                    chai.expect(res.text).to.not.contain('Delete');
                    done();
                });
        });
        // Access edit page for someone else's listing
        it('Access edit page for someone else\'s listing', done => {
            agent
                .get('/aircraft/65f9f9e772bc0a4a44fdedb6/edit')
                .end((err, res) => {
                    // Expect 401
                    chai.expect(res).to.have.status(401);
                    done();
                });
        });
        // Edit someone else's listing
        it('Edit someone else\'s listing', done => {
            agent
                .put('/aircraft/65f9f9e772bc0a4a44fdedb6')
                .type('form')
                .field('title', 'Test Listing')
                .field('details', 'This is a test listing')
                .field('price', 100000)
                .field('condition', 'New')
                .end((err, res) => {
                    // Expect 401
                    chai.expect(res).to.have.status(401);
                    done();
                });
        });
        // Delete someone else's listing
        it('Delete someone else\'s listing', done => {
            agent
                .delete('/aircraft/65f9f9e772bc0a4a44fdedb6')
                .end((err, res) => {
                    // Expect 401
                    chai.expect(res).to.have.status(401);
                    done();
                });
        });
        // access the registration page
        it('Access the registration page', done => {
            agent
                .get('/users/new')
                .end((err, res) => {
                    chai.expect(res.redirects[0]).to.contain('/users/profile');
                    done();
                });
        });
        // register a new user
        it('Register a new user', done => {
            agent
                .post('/users')
                .type('form')
                .send({
                    email: 'jdoe@gmail.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    password: '12345678'
                })
                .end((err, res) => {
                    chai.expect(res.redirects[0]).to.contain('/users/profile');
                    done();
                });
        });
    });
    // Can logout
    it('Can Logout', done => {
        agent
            .get('/users/logout')
            .end((err, res) => {
                chai.expect(res).to.redirect;
                chai.expect(res.redirects[0]).to.contain('/');
                done();
            });
    });
});
