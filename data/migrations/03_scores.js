exports.up = function(knex) {
    return knex.schema.createTable('scores', tbl => {
      tbl.increments('id');
      tbl.integer('class_id').notNullable().references('classes.id').onDelete('cascade');
      tbl.string('date');
      tbl.integer('score');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('scores');
  };