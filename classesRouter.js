const express = require('express');
const router = express.Router();
const auth_middleware = require('./auth_middleware');
const usersDB = require ('./data/users_model');
const classesDB = require('./data/classes_model');


router.use(auth_middleware);

// Gets all classes for current user
router.get('/', (req, res) => {
    classesDB.getClasses(req.user.user_id)
    .then(classes => res.status(200).json(classes))
    .catch(err => {console.log(err); res.status(500).json({message: "Classes could not be loaded."})});
})

// Get a class by id
router.get('/:id', (req, res)=> {
    classesDB.getClass(req.params.id).where({user_id: req.user.user_id})
    .select('sensitivity', 'highscore')
    .then(_class => res.status(200).json(_class))
    .catch (err => res.status(500).json({message:'Could not load class'}));
});

// Create a class for current user, returns class_id
router.post('/', (req, res) => {
    if(req.body.classname==undefined) {
        res.status(400).json({message: "classname required"});
    } else {
        classesDB.addClass({user_id: req.user.user_id, classname: req.body.classname})
        .then(id => res.status(200).json({class_id: id}))
        .catch(err => {console.log(err); res.status(500).json(err)});
    }
});

// Updates class (sensitivity and/or highscore), returns updated sensitivity and highscore
router.put('/:id', (req, res) => {
    if(req.body.sensitivity==undefined && req.body.highscore==undefined) {
        res.status(400).json({message: "Sensitivity and/or highscore required."})
    } else {
        classesDB.getClass(req.params.id).where({user_id:req.user.user_id}).select('id', 'sensitivity', 'highscore')
        .then (
            _class => {
                if (_class==undefined) {
                    res.status(400).json({message: "Class not found."});
                } else {
                    if (req.body.sensitivity){
                        _class = {..._class, sensitivity: req.body.sensitivity};
                    }
                    if (req.body.highscore){
                        _class = {..._class, highscore:parseInt(req.body.highscore)};
                    }
                    classesDB.updateClass(req.params.id, _class)
                    .then(count => {
                        if (count==1) {
                            classesDB.getClass(req.params.id)
                            .select('sensitivity', 'highscore')
                            .then(newClass => res.status(200).json(newClass));
                        } else {
                            res.status(500).json({message: "Could not update class."});
                        }
                    })
                    .catch(err => {console.log(err); res.status(500).json(err)});
                }
            })
        .catch (err => {console.log(err); res.status(500).json(err)});
    }
});

// Deletes a class
router.delete('/:id', (req, res) => {
    classesDB.deleteClass(req.params.id)
    .then(count => {
        if (count==1) {
            res.sendStatus(200);
        } else {
            res.status(500).json({message: "Class could not be deleted."});
        }
    })
    .catch(err => {console.log(err); res.status(500).json(err)});
});


// Get scores for class :id
router.get('/:id/scores', (req, res) => {
    classesDB.getClass(req.params.id).where({user_id:req.user.user_id})
    .then(_class => {
        if (_class==undefined) {
            res.status(400).json({message: "Class not found."});
        } else {
            classesDB.getScores(req.params.id)
            .then(scores => res.status(200).json(scores))
            .catch(err => {console.log(err); res.status(500).json(err)});
        }
    })
    .catch(err => {console.log(err); res.status(500).json(err)});
})

// Add score for class :id
router.post('/:id/scores', (req, res) => {
    if (req.body.score == undefined) {
        res.status(400).json({message: "Score is required."});
    } else {
        classesDB.getClass(req.params.id).where({user_id:req.user.user_id})
        .then(_class => {
            if (_class==undefined) {
                res.status(400).json({message: "Class not found."});
            } else {
                classesDB.addScore(req.params.id,req.body.score)
                .then(ids => res.sendStatus(200))
                .catch(err => {console.log(err); res.status(500).json(err)});
            }
        })
        .catch(err => {console.log(err); res.status(500).json(err)});
    }
})

// Delete all scores for class
router.delete('/:id/scores', (req, res) => {
    classesDB.getClass(req.params.id).where({user_id:req.user.user_id})
    .then(_class => {
        if (_class==undefined) {
            res.status(400).json({message: "Class not found."});
        } else {
            classesDB.deleteScores(req.params.id)
            .then(count => res.sendStatus(200))
            .catch(err => {console.log(err); res.status(500).json(err)});
        }
    })
    .catch(err => {console.log(err); res.status(500).json(err)});
})
module.exports = router;