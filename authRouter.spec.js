const request = require('supertest');
const server = require('./server');
const db = require('./data/users_model');

describe('auth-router', () => {
    describe('register', () => {
        it('fails without username and password', () => {
            return request(server)
            .post('/api/auth/register')
            .then(res => {
                expect(res.status).toBe(400);
            });
        });
        it('passes with username and password', () => {
            db.deleteUser('Bob').then(count=>count);
            return request(server)
            .post('/api/auth/register')
            .send({username:'Bob',password:'Bob123'})
            .then(res => {
                expect(res.status).toBe(200);
            })
        })
    });
    describe('login', () => {
        db.add({username:'Bob',password:'Bob123'}).catch(err=>err);
        it('fails without username and password', () => {
            return request(server)
            .post('/api/auth/login')
            .then(res => expect(res.status).toBe(400));
        });
        it('fails with incorrect password', () => {
            return request(server)
            .post('/api/auth/login')
            .send({username:'Bob',password:'password'})
            .then(res => expect(res.status).toBe(401));
        });
        it('passes with correct password', () => {
            return request(server)
            .post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => expect(res.status).toBe(200));
        });
    });
    describe('update', () => {
        it('fails when logged out', () => {
            return request(server)
            .put('/api/auth')
            .then(res => expect(res.status).toBe(401));
        });
        it('should require a password', () => {
            return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => {
                const token = res.body.token;
                return request(server).put('/api/auth')
                .set('Authorization',token)
                .then(res2 => expect(res2.status).toBe(400));
            });
        });
        it('should update the password', () => {
            return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => {
                const token = res.body.token;
                return request(server).put('/api/auth')
                .set('Authorization',token)
                .send({password: "Bob123"})
                .then(res2 => expect(res2.status).toBe(200));
            });
        });
    });
});

