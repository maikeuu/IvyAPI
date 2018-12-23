var mongoose = require('mongoose');
var User = require('../api/models/user');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app')
var should = chai.should();
var expect = chai.expect;


process.env['JWT_KEY'] = "secret"


chai.use(chaiHttp);
// Parent block 
describe('Users', ()=> {
  before(function (done) {
    User.remove({}, function(err) {
      if (err) done(err);
      else done();
    });
  })
  describe('/POST user suite', () => {
    var id;
    // Test creating one user
    it('should be able to create a user in our database', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('content-type', 'application/json')
        .send({email: "foobar@gmail.com", password: "abc123"})
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message');
          done();
        });
    });
    // Test not being able to create the same email
    it('should not be able to create the same user in our database', (done) => {
      chai
        .request(server)
        .post('/user/signup')
        .set('content-type', 'application/json')
        .send({email: "foobar@gmail.com", password: "abc123"})
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('message').eql('Email already exists');
          done();
        });
    });
    // Test being able to log in
    it('should be able to log in to the database', (done) => {
      chai
        .request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send({email: "foobar@gmail.com", password: "abc123"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Auth successful');
          done();
        });
    });
    // test wrong password
    it('should not be able to log in with the wrong password', function(done) {
      chai
        .request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send({email: "foobar@gmail.com", password: "blah"})
        .end(function(err, res) {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Auth failed');
          done();
        });
    });
    // Test wrong email
    it('should not be able to log in with the wrong email', function(done) {
      chai
        .request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send({email: "foobar@yahoo.com", password: "abc123"})
        .end(function(err, res) {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('Auth failed');
          done();
        });
    });
  });
});
