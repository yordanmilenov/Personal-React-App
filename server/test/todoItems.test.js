const app = require('../index');
const Item = require('../models/todoItems');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

describe('Operations', function () {
  beforeEach(async function () {
    await Item.deleteMany({});
  });

  it('/GET items should return an array of items', function (done) {
    request(app)
      .get('/api/items')
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('/POST item should create a new item', function (done) {
    const item = { item: 'Go visit my father' };
    // trqq da doopraa 

    request(app)
      .post('/api/item')
      .send(item)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.have.property('_id');
        expect(res.body.item).to.equal(item.item);
        done();
      });
  });

  it("/POST item unsuccesfull", function (done) { 
    request(app)
        .post("/api/item")
        .send() 
        .expect(404)
        .end(function (err, res) {
            if (err) return done(err); 
            expect(res.body).to.deep.equal({ message: "Something's wrong" });
            done(); 
        });
    });

    it('/PUT item', function (done) {
        const newItem = new Item({ item: 'Go pay my electricity' });
        newItem.save(newItem);

        const updatedItem = { item: 'Go pay my gas bill' };
          
        request(app)
          .put(`/api/item/${newItem._id}`)
          .send(updatedItem)
          .expect(200)
          .end(function (err, res) {
              console.log(res.body)
              if (err) return done(err);
              expect(res.body).to.have.property('_id', newItem._id.toString());
              expect(res.body.item).to.deep.equal('Go pay my gas bill');
              done();
            });
    });

   
    it('/DELETE item should delete an existing item', function (done) {
        const newItem = new Item({ item: 'Go to the grocery store' });
        newItem.save(newItem) 
          request(app)
            .delete(`/api/item/${newItem._id}`)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.equal('Item Deleted');
                done();
            });
    });
    

  it('/DELETE item unsuccesfull ', function (done) {

    request(app)
      .delete('/api/item/6415fbe26af10465cca513f1')
      .expect(404)
      .send()
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.deep.equal({ message: 'Item not found' });
        done();
      });
  });
});




