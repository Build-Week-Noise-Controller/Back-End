const db = require('./dbConfig');

function find() {
    return db('users') //.select('id', 'username');
}

function findById(id) {
    return db('users').where({id}).first();
}

function findByUsername(username) {
    return db('users').where({username}).first();
}

function add(user) {
    return db('users').insert(user, 'id')
    .then(ids => findById(ids[0]));
}

function update(user) {
 return db('users').where('id', '=', user.id).update(user);
}

function deleteUser(username) {
    return db('users').where({username}).del();
}

module.exports = {find, findById, findByUsername, add, update, deleteUser};