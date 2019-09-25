const request = require('supertest');
const server = require('./server');
const db = require('./data/users_model');

describe('usersRouter', () => {
    it('should get sensitivity and highschore', () => {
        db.findByUsername('Bob')
        .then(user => db.update({...user, sensitivity:'medium', highscore:100}));
        return request(server).post('/api/auth/login')
        .send({username:'Bob',password:'Bob123'})
        .then(res => {
            const token = res.body.token;
            request(server).get('/api/users')
            .set('Authorization',token)
            .then(res2 => expect(res2.body.sensitivity=='medium' && res2.body.highscore==100).toBe(true));
        });
    });
    it('should fail if sensitivity and highscore not set', () => {
        return request(server).post('/api/auth/login')
        .send({username:'Bob',password:'Bob123'})
        .then(res => {
            const token = res.body.token;
            return request(server).put('/api/users')
            .set('Authorization',token)
            .then(res2 => expect(res2.status).toBe(400));
        });
    });
    it('should update sensitivity', () => {
        db.findByUsername('Bob')
        .then(user => db.update({...user, sensitivity:"Low"}));
        return request(server).post('/api/auth/login')
        .send({username:'Bob',password:'Bob123'})
        .then(res => {
            const token = res.body.token;
            return request(server).put('/api/users')
            .set('Authorization',token)
            .send({sensitivity: "High"})
            .then(res2 => expect(res2.body.sensitivity).toBe("High"));
        });
    });
    it('should update highscore', () => {
        db.findByUsername('Bob')
        .then(user => db.update({...user, highscore: 0}));
        return request(server).post('/api/auth/login')
        .send({username:'Bob',password:'Bob123'})
        .then(res => {
            const token = res.body.token;
            return request(server).put('/api/users')
            .set('Authorization',token)
            .send({highscore: 200})
            .then(res2 => expect(res2.body.highscore).toBe(200));
        });
    });
})