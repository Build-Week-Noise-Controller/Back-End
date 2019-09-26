exports.seed = function(knex) {
    return knex('classes').truncate().insert([
        {classname: "Bob's Class", user_id: 1},
        {classname: "Jim's Class", user_id: 2}
    ])
}