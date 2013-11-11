/*global describe, it */
describe('api', function(){
  describe('GET /api/users', function(){
    it('respond with an array of users');
  });
})

describe('app', function(){
  describe('GET /users', function(){
    it('respond with an array of users', function(){
      chai.should();
      var foo = "asdf";
      foo.should.be.a('string');
      // expect(foo).to.be.a('string');
    });
  })
})