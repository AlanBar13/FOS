import server from "../../server";
import { expect } from "chai";
import request from "supertest";

describe('Admin Order Routes', () => {
    describe('GET /v1/admin/order', () => {
        let response: request.Response;

        before(async () => {
            response = await request(server).get('/v1/admin/order');
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should be an a valid response', () => {
            expect(response.body).to.be.an('array');
        });

        it('should have the correct properties', () => {
            expect(response.body[0]).to.have.property('id');
            expect(response.body[0]).to.have.property('tableId');
            expect(response.body[0]).to.have.property('subtotal');
            expect(response.body[0]).to.have.property('taxTotal');
            expect(response.body[0]).to.have.property('total');
            expect(response.body[0]).to.have.property('status');
        });
    });
    
    describe('GET /v1/admin/order/summary', () => {
        let response: request.Response;

        before(async () => {
            response = await request(server).get('/v1/admin/order/summary');
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should be an a valid response', () => {
            expect(response.body).to.be.an('object');
        });

        it('should have the correct properties', () => {
            expect(response.body).to.have.property('mostOrdered');
            expect(response.body).to.have.property('totalToday');
            expect(response.body).to.have.property('ordersToday');
            expect(response.body).to.have.property('orderClosed');
        });
    });

    describe('GET /v1/admin/order/:id', () => {
        let response: request.Response;
        const orderId = 2;

        before(async () => {
            response = await request(server).get(`/v1/admin/order/${orderId}`);
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should be an a valid response', () => {
            expect(response.body).to.be.an('object');
        });

        it('should have the correct properties', () => {
            expect(response.body).to.have.property('order');
            expect(response.body).to.have.property('items');
        });
    });

    describe('POST /v1/admin/order/:id/status/change/:status', () => {
        let response: request.Response;
        const orderId = 2;
        const status = 'user-closed';

        before(async () => {
            response = await request(server).post(`/v1/admin/order/${orderId}/status/change/${status}`);
        });

        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });

        it('should be an a valid response', () => {
            expect(response.body).to.be.an('object');
        });

        it('should have new status', () => {
            expect(response.body.status).equal(status);
        });

        after(async () => {
            await request(server).post(`/v1/admin/order/${orderId}/status/change/paid`);
        });
    });

    describe('POST /v1/admin/order/:id/status/ready', () => {
        const orderId = 2;

        it('should return status 400', async () => {
            const response = await request(server).post(`/v1/admin/order/${orderId}/status/ready`);
            expect(response.status).equal(400);
        });

        it('should return status 200', async () => {
            let response = await request(server).post(`/v1/admin/order/${orderId}/status/change/inKitchen`);
            response = await request(server).post(`/v1/admin/order/${orderId}/status/ready`);
            expect(response.status).equal(200);
        });

        after(async () => {
            await request(server).post(`/v1/admin/order/${orderId}/status/change/paid`);
        });
    });
});