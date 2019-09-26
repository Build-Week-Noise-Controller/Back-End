exports.up = function(knex) {
    return knex.schema.createTable('classes', tbl => {
      tbl.increments('id');
  
      tbl
        .string('classname', 255)
        .notNullable()
        .unique();
      tbl.integer('user_id').notNullable().references('users.id').onDelete('cascade');
      tbl.integer('highscore');
      tbl.string('sensitivity');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('classes');
  };