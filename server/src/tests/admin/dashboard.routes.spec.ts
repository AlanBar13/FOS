import server from "../../server";
import { expect } from "chai";
import request from "supertest";

describe('Dashboard Admin Routes', () => {
    describe('GET /v1/admin/dashboard', () => {
        let response: request.Response;
    
        before(async () => {
            response = await request(server).get('/v1/admin/dashboard');
        });
    
        it('should return 200 OK', () => {
            expect(response.status).equal(200);
        });
    
        it('should be an a valid response', () => {
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('inProgress');
            expect(response.body).to.have.property('ordered');
        });
    });
});