const db = require('./dbConfig');
const knex = require('knex');

function getClasses(user_id) {
    return db('classes').where('user_id','=',user_id);
}

function getClass(id) {
    return db('classes').where({id}).first();
}

function updateClass(id, _class) {
    return db('classes').where({id}).update(_class);
}

function addClass(_class) {
    return db('classes').insert(_class, 'id')
            .then(ids => ids[0]);
}

function deleteClass(id) {
    return db('classes').where({id}).del();
}

function getScores(id) {
    return db('scores').where({class_id: id});
}

function addScore(id, score) {
    date=new Date().toLocaleDateString('en-US');
    return db('scores').where({class_id: id, date:date})
    .then(scores => {
        if(scores.length>=1) {
            prev_score = scores[0];
            if (score > prev_score.score) {
                return db('scores').update({id: prev_score.id, score: score}, 'score');
            } else {
                return db('scores').select('id').where({id:prev_score.id});
            }
        } else {
            return db('scores').insert({class_id:id, score:score, date:date}, 'score');
        }
    })
    return db('scores').insert({class_id: id, score: score, date:new Date().toLocaleDateString('en-US')}, 'id');
}

function deleteScores(id) {
    return db('scores').where({class_id: id}).del();
}

module.exports = {getClasses, getClass, updateClass, deleteClass, addClass, getScores, addScore, deleteScores};