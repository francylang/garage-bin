
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('garage_items', (table) => {
      table.increments('id').primary();
      table.string('item');
      table.string('reason');
      table.string('cleanliness')
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  Promise.all([
    knex.schema.dropTable('garage_items')
  ])
};
