const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('test auth routes', () => {
  // describe('test signup route', () => {
  //   it('fails if no email or password is provided', () => {
  //     return chai.request(app)
  //       .get('/')
  //       .then(response => {
  //         expect(response).to.have.status(200);
  //         expect(response).to.be.text;
  //       })
  //   });
  // });
  describe('test signup route', () => {
    it('fails if no email or password is provided', () => {
      return chai.request(app)
        .post('/api/auth/signup')
        .then(response => {
          expect(response).to.have.status(400);
          expect(response).to.be.json;
        })
    });
    it('fails if no email or password is provided', () => {
      return chai.request(app)
        .post('/api/auth/signup')
        .send({
          email: 'johndoe@wcs.fr', password: 'ab'
        })
        .then(response => {
          expect(response).to.have.status(400);
          expect(response.body).to.deep.equal({
            error: 'password is too short'
          });
          expect(response).to.be.json;
        })
    });
    it('succeeds if email or password is provided', () => {
      return chai.request(app)
        .post('/api/auth/signup')
        .send({
          email: 'johndoe@wcs.fr', password: 'abcd1234'
        })
        .then(response => {
          expect(response).to.have.status(201);
          expect(response).to.be.json;
        })
    });
  });
  describe('test signin route', () => {

  });
});