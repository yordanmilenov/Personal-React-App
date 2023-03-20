const app = require("../index");
const Item = require("../models/todoItems");
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

const urlPath = "/api/item"

describe("Operations", function () {
    beforeEach(async function () {
        await Item.deleteMany({});
    });

    it("/GET items should return an array of items", function (done) {
        const items = [
            { item: "Go to Kaufland" },
            { item: "Go to Metro" },
            { item: "Go to Billa" },
        ];
        Item.insertMany(items);

        request(app)
            .get(`${urlPath}s`)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res.body).to.be.an("array");
                expect(res.body.length).to.equal(3);
                expect(res.body[0].item).to.equal("Go to Kaufland");
                expect(res.body[1].item).to.equal("Go to Metro");
                expect(res.body[2].item).to.equal("Go to Billa");
                done();
            });
    });

    it("/POST item should create a new item", function (done) {
        const item = { item: "Go visit my father" };

        request(app)
            .post(urlPath)
            .send(item)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res.body).to.have.property("_id");
                expect(res.body.item).to.equal(item.item);
                done();
            });
    });

    it("/POST item unsuccesfull", function (done) {
        request(app)
            .post(urlPath)
            .send()
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.deep.equal({
                    message: "Something's wrong",
                });
                done();
            });
    });

    it("/PUT item", function (done) {
        const newItem = new Item({ item: "Go pay my electricity" });
        newItem.save(newItem);

        const updatedItem = { item: "Go pay my gas bill" };

        request(app)
            .put(`${urlPath}/${newItem._id}`)
            .send(updatedItem)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property(
                    "_id",
                    newItem._id.toString()
                );
                expect(res.body.item).to.deep.equal("Go pay my gas bill");
                done();
            });
    });

    it("/DELETE item should delete an existing item", function (done) {
        const newItem = new Item({ item: "Go to the grocery store" });
        newItem.save(newItem);
        request(app)
            .delete(`${urlPath}/${newItem._id}`)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.equal("Item Deleted");
                done();
            });
    });

    it("/DELETE item unsuccesfull ", function (done) {
        request(app)
            .delete(`${urlPath}/6415fbe26af10465cca513f1`)
            .expect(404)
            .send()
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.deep.equal({ message: "Item not found" });
                done();
            });
    });
});
