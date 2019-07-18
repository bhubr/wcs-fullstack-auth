const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const db = require('../../db');
const expect = chai.expect;

chai.use(chaiHttp);

describe('test user routes', () => {

  beforeEach(() => db.queryAsync('TRUNCATE TABLE user'));
  
  describe('test update profile route', () => {
    it('fails if user is not connected', () => {
      return chai.request(app)
        .put('/api/users/10')
        .then(response => {
          expect(response).to.have.status(401);
        })
    });

    it('fails if wrong user is connected', () => {
      return chai.request(app)
        .post('/api/auth/signup')
        .send({
          email: 'johndoe@wcs.fr', password: 'abcd1234'
        })
        .then(() => chai.request(app)
        .post('/api/auth/signin')
        .send({
          email: 'johndoe@wcs.fr', password: 'abcd1234'
        })
        )
        // .put('/api/users/10')
        .then(response => {
          const token = response.body.token;
          return chai.request(app)
          .put('/api/users/10')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'toto@toto.com' })
          // expect(response).to.have.status(401);
          console.log(response);
        })
        .then(response => {
          expect(response).to.have.status(403);
          expect(response.body).to.deep.equal({
            error: 'This profile is not yours!!'
          });
        })
    });
    
    // it('succeeds if email or password is provided', () => {
    //   return chai.request(app)
    //     .post('/api/auth/signup')
    //     .send({
    //       email: 'johndoe@wcs.fr', password: 'abcd1234'
    //     })
    //     .then(response => {
    //       expect(response).to.have.status(201);
    //       expect(response).to.be.json;
    //     })
    // });
  });
  
});