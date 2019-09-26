const express = require('express');
const router = express.Router();
const auth_middleware = require('./auth_middleware');
const usersDB = require ('./data/users_model');
const classesDB = require('./data/classes_model');

router.use(auth_middleware);

// Deletes the current user
router.delete('/', (req, res) => {
    usersDB.deleteUser(req.user.username)
    .then(count => {
        if (count==1) {
            res.sendStatus(200);
        } else {
            res.status(500).json({message: "Could not delete user."})
        }
    })
    .catch(err => {console.log(err); res.status(500).json(err)});
})

// router.get('/:id', (req, res) => {
//     db.findById(req.params.id)
//     .then(user => res.status(200).json(user))
//     .catch(err => {console.log(err); return res.status(500).json({message: "Error retrieving user."})});
// })

module.exports = router