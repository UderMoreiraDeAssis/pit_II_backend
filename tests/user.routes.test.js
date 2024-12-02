const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('User Routes', () => {
  describe('/POST api/auth/register', () => {
    it('it should create a new user', (done) => {
      chai
        .request(server)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.should.have.property('token');
          done();
        });
    });
  });
});
