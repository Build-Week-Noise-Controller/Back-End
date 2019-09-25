const express = require('express');
const router = express.Router();
const auth_middleware = require('./auth_middleware');
const db = require ('./data/users_model');

router.get ('/', auth_middleware, (req, res)=> {
    db.findById(req.user.user_id).select('sensitivity', 'highscore')
    .then(user => res.status(200).json(user))
    .catch (err => res.status(500).json({message:'Could not load user'}));
})

router.put ('/', auth_middleware, (req, res) => {
    if(req.body.sensitivity==undefined && req.body.highscore==undefined) {
        res.status(400).json({message: "Sensitivity and/or highscore required."})
    } else {
        db.findById (req.user.user_id).select('id', 'sensitivity', 'highscore')
        .then (user => {
            if (req.body.sensitivity){
                user = {...user, sensitivity: req.body.sensitivity};
            }
            if (req.body.highscore){
                user = {...user, highscore:parseInt(req.body.highscore)};
            }
            db.update(user)
            .then (count => {
            if (count == 1){
                    db.findById(req.user.user_id).select('sensitivity', 'highscore')
                    .then (user => res.status(200).json(user));
                } else {
                    res.status(500).json({message:"User could not be updated."});
                }
            })
            .catch (err => {console.log (err); res.status(500).json({message:"User could not be updated."})});
        })
    }
})

router.get('/:id', auth_middleware, (req, res) => {
    db.findById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => {console.log(err); return res.status(500).json({message: "Error retrieving user."})});
})

module.exports = router