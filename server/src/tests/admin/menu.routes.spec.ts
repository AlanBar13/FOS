import server from "../../server";
import { expect } from "chai";
import request from "supertest";

describe('Admin Menu Routes', () => {
    const mockMenuItem = {
        name: "Test Item",
        price: 10.99,
        description: "Test Description",
        available: true,
        category: "Test Category",
        tax: 0.99,
        img: "https://www.google.com"
    };
    let mockMenuItemId: number;

    describe('POST /v1/admin/menu', () => {
        let response: request.Response;

        before(async () => {
            response = await request(server).post('/v1/admin/menu').send(mockMenuItem);
            mockMenuItemId = response.body.id;
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should have an item with the correct properties', () => {
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('price');
            expect(response.body).to.have.property('description');
            expect(response.body).to.have.property('available');
            expect(response.body).to.have.property('category');
            expect(response.body).to.have.property('tax');
            expect(response.body).to.have.property('img');
        });

        it('should have the correct values', () => {
            expect(response.body.name).to.equal(mockMenuItem.name);
            expect(response.body.price).to.equal(mockMenuItem.price);
            expect(response.body.description).to.equal(mockMenuItem.description);
            expect(response.body.available).to.equal(mockMenuItem.available);
            expect(response.body.category).to.equal(mockMenuItem.category);
            expect(response.body.tax).to.equal(mockMenuItem.tax);
            expect(response.body.img).to.equal(mockMenuItem.img);
        });
    });

    describe('GET /v1/admin/menu/:id', () => {
        let response: request.Response;

        before(async () => {
            response = await request(server).get(`/v1/admin/menu/${mockMenuItemId}`);
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should have the correct values', () => {
            expect(response.body.name).to.equal(mockMenuItem.name);
            expect(response.body.price).to.equal(mockMenuItem.price);
            expect(response.body.description).to.equal(mockMenuItem.description);
            expect(response.body.available).to.equal(mockMenuItem.available);
            expect(response.body.category).to.equal(mockMenuItem.category);
            expect(response.body.tax).to.equal(mockMenuItem.tax);
            expect(response.body.img).to.equal(mockMenuItem.img);
        });
    });

    describe('PATCH /v1/admin/menu/:id', () => {
        let response: request.Response;

        before(async () => {
            response = await request(server).patch(`/v1/admin/menu/${mockMenuItemId}`).send({ name: 'Updated Name' });
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should have the correct values', () => {
            expect(response.body.name).to.equal('Updated Name');
            expect(response.body.price).to.equal(mockMenuItem.price);
            expect(response.body.description).to.equal(mockMenuItem.description);
            expect(response.body.available).to.equal(mockMenuItem.available);
            expect(response.body.category).to.equal(mockMenuItem.category);
            expect(response.body.tax).to.equal(mockMenuItem.tax);
            expect(response.body.img).to.equal(mockMenuItem.img);
        });
    });

    describe('GET /v1/admin/menu', () => {
        let response: request.Response;

        before(async () => {
            response = await request(server).get('/v1/admin/menu');
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should have at least one item', () => {
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
        });

        it('should have an item with the correct properties', () => {
            expect(response.body[0]).to.have.property('id');
            expect(response.body[0]).to.have.property('name');
            expect(response.body[0]).to.have.property('price');
            expect(response.body[0]).to.have.property('description');
            expect(response.body[0]).to.have.property('available');
            expect(response.body[0]).to.have.property('category');
            expect(response.body[0]).to.have.property('tax');
            expect(response.body[0]).to.have.property('img');
        });
    });

    describe('DELETE /v1/admin/menu/:id', () => {
        let response: request.Response;

        before(async () => {
            response = await request(server).delete(`/v1/admin/menu/${mockMenuItemId}`);
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });
    });
});