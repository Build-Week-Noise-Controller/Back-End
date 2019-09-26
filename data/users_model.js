const db = require('./dbConfig');
const classDB = require('./classes_model');

function find() {
    return db('users') //.select('id', 'username');
}

function findById(id) {
    return db('users').where({id}).first();
}

function findByUsername(username) {
    return db('users').where({username}).first();
}

function add(user, classname) {
    return db('users').insert(user, 'id')
    .then(user_ids => db('classes').insert({user_id: user_ids[0], classname: classname}, 'id')
        .then(classes_id => classDB.getClasses(user_ids[0]).first().join('users','users.id', '=', 'classes.user_id')
            .column({class_id: 'classes.id'}))
    );
}

function update(user) {
 return db('users').where('id', '=', user.id).update(user);
}

function deleteUser(username) {
    return db('users').where({username}).del();
}

module.exports = {find, findById, findByUsername, add, update, deleteUser};