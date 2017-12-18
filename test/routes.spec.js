const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {

});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => {
        throw error;
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return all of the items', () => {
      return chai.request(server)
      .get('/api/v1/items')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('item');
        response.body.includes('Stuffed Grizzly Bear');
        response.body[0].should.have.property('reason');
        response.body.includes('family-favorite');
        response.body[0].should.have.property('cleanliness');
        response.body.includes('dusty');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
      })
      .catch(error => {
        throw error;
      });
    })

  })
});
