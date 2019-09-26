const request = require('supertest');
const server = require('./server');
const bcrypt = require('bcryptjs');
const db = require('./data/users_model');

describe('usersRouter', () => {
    it('should delete the current user', () => {
       return request(server).post('/api/auth/login')
               .send({username:'Bob',password:'Bob123'})
               .then(res => {
                   const token = res.body.token;
                   request(server).delete('/api/users')
                   .set('Authorization',token)
                   .then(res2 => expect(res2.status).toBe(200));
               });
    });
});

describe('auth-router', () => {
    describe('register', () => {
        it('fails without username, password, and classname', () => {
            return request(server)
            .post('/api/auth/register')
            .then(res => {
                expect(res.status).toBe(400);
            });
        });
        db.deleteUser('Bob');
        it('passes with username, password, and classname', () => {
            request(server)
            .post('/api/auth/register')
            .send({username:'Bob', password:'Bob123', classname:"Bob's class"})
            .then(res => expect(res.status).toBe(200));
        })
    });
    describe('login', () => {
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

describe('classesRouter', () => {
    it('should retrieve classes', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res => expect(res.body.length>=1).toBe(true))
            );
    });
    it('should retrieve a class by id', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res2 => 
                    request(server).get('/api/classes/'+(res2.body)[0].id)
                    .set('Authorization',res.body.token)
                    .then(res3 => expect(res3.status).toBe(200))
                )
            );
    });
    it('should fail to update a class without data', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res2 => 
                    request(server).put('/api/classes/'+(res2.body)[0].id)
                    .set('Authorization',res.body.token)
                    .then(res3 => expect(res3.status).toBe(400))
                )
            );
    });
    it('should update a class', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res2 => 
                    request(server).put('/api/classes/'+(res2.body)[0].id)
                    .set('Authorization',res.body.token)
                    .send({highscore:700})
                    .then(res3 => {expect(res3.status).toBe(200); expect(res3.body.highscore).toBe(700);})
                )
            );
    });

    it('should add a class', () => {
            return request(server).post('/api/auth/login')
                .send({username:'Bob',password:'Bob123'})
                .then(res => 
                    request(server).get('/api/classes')
                    .set('Authorization',res.body.token)
                    .then(res2 => 
                        request(server).post('/api/classes')
                        .set('Authorization',res.body.token)
                        .send({classname: "Bob's second class"})
                        .then(res3 => expect(res3.status).toBe(200))
                    )
                );
    });

    it('should delete a class', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res2 =>
                    request(server).delete('/api/classes/'+(res2.body)[res2.body.length-1].id)
                    .set('Authorization',res.body.token)
                    .then(res3 => expect(res3.status).toBe(200))
                )
            );
    });

    it('should add a score for a class', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res2 => 
                    request(server).post('/api/classes/'+(res2.body)[0].id+'/scores')
                    .set('Authorization',res.body.token)
                    .send({score:700})
                    .then(res3 => expect(res3.status).toBe(200))
                )
            );
    });

    it('should retrieve scores for a class', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res2 => 
                    request(server).get('/api/classes/'+(res2.body)[0].id+'/scores')
                    .set('Authorization',res.body.token)
                    .then(res3 => {expect(res3.status).toBe(200);
                                    expect(res3.body.length>=1).toBe(true);})
                )
            );
    });

    it('should delete scores for a class', () => {
        return request(server).post('/api/auth/login')
            .send({username:'Bob',password:'Bob123'})
            .then(res => 
                request(server).get('/api/classes')
                .set('Authorization',res.body.token)
                .then(res2 => 
                    request(server).delete('/api/classes/'+(res2.body)[0].id+'/scores')
                    .set('Authorization',res.body.token)
                    .then(res3 => expect(res3.status).toBe(200))
                )
            );
    });

});
