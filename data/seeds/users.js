exports.seed = function(knex) {
    return knex('users').truncate().insert([
        {username: "Bob",
            password: "$2a$08$qeXsBQXKFt2/pq4.F4R6S.FOoZGnCjWvwAwGqQNH3jMtMmG/1dham"},
        {username: "Jim",
            password: "$2a$08$8bGt7Ta2Fa1vin3jYrFpDObHABaOuxgaYdXFbmwOz9twFStIGlWJ6"}
    ])
}