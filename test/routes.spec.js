const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {});

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
      return chai.request(server).get('/api/v1/items').then(response => {
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
      }).catch(error => {
        throw error;
      });
    });

    it('should return a 404 if path does not exist', (done) => {
      chai.request(server)
        .get('/api/v1/sad')
        .end((error, response) => {
          response.should.have.status(404);
          done();
      });
    });
  });

  describe('GET /api/v1/items/:id', () => {

    it('should return a single item', () => {
      return chai.request(server)
      .get('/api/v1/items/2')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
      })
    })

    it('should return a 404 if path does not exist', (done) => {
      chai.request(server)
        .get('/api/v1/sad')
        .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('POST /api/v1/items', () => {

    it('should be able to add an item to the database', () => {
      return chai.request(server)
      .post('/api/v1/items').send({
          item: 'goKart',
          reason: 'kids love it',
          cleanliness: 'sparkling'
        })
        .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('array');
      })
      .catch(error => {
        throw error;
      });
    });

    it('should not be able to add a new item if property is missing', () => {
      chai.request(server)
        .post('/api/v1/items')
        .send({item: 'train'})
        .end((error, response) => {
          response.should.have.status(422);
      });
    });
  })

  describe('PATCH /api/v1/items/:id', () => {
    const updateItem = {
      cleanliness: 'sparkling'
    };

    it('should be able to update the body of an item object', () => {
      chai.request(server)
        .patch('/api/v1/items/1')
        .send(updateItem)
        .end((error, response) => {
          response.should.have.status(204);

        chai.request(server)
          .get('/api/v1/items/1')
          .end((error, response) => {
          response.body.should.be.a('array');
          response.body[1].should.have.property('body');
          response.body[1].body.should.equal(updateItem.body);
        });
      });
    });


    it.skip('should throw a 422 if item cleanliness is not provided', (done) => {
         chai.request(server)
           .patch('/api/v1/items/1')
           .send()
           .end((error, response) => {
             response.should.have.status(422);
             done();
           });
       });
  });
});
