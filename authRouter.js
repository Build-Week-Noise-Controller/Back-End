const jwt = require('jsonwebtoken');
const secrets = require('./secrets');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/users_model');
const router = express.Router();
const auth_middleware = require('./auth_middleware');


router.post('/register', (req, res) => {
    if(req.body.username==undefined || req.body.password==undefined) {
        res.status(400).json({message: "Username and password required."})
    }
    hash = bcrypt.hashSync(req.body.password, 8);
    user = {...req.body, password: hash};
    db.add(user)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

router.post('/login', (req, res) => {
    if(req.body.username==undefined || req.body.password==undefined) {
        res.status(400).json({message: "Username and password required."})
    } else {
        db.findByUsername(req.body.username)
        .then(user => {
            if (user && bcrypt.compareSync(req.body.password,user.password)) {
                const token = generateToken(user);
                res.status(200).json({token});
            } else {
                res.status(401).json({message: "You shall not pass!"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    }
})

router.put('/', auth_middleware, (req,res) => {
    if(req.body.password == undefined){
        res.status(400).json({message:"Password required."});
    } else {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        db.update({id:req.user.user_id, password:req.body.password})
        .then (count => {
            if (count == 1){
                res.sendStatus(200);
            } else { 
                res.status(500).json({message:"Password update failed."});
            }})
        .catch (err => {console.log(err); res.status(500).json({message:"Password update failed"})});
    }
})

// router.get('/users', auth_middleware, (req, res) => {
//     console.log(req.user);
//     db.find()
//     .then(users => res.status(200).json(users))
//     .catch(err => res.status(500).json(err));
// })

function generateToken(user) {
    const payload = {
        username: user.username,
        user_id: user.id
    };
    const options = {
        expiresIn: '1d',
    };
    return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router