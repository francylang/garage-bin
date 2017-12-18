
exports.seed = (knex, Promise) => {
  return knex('garage_items').del()
    .then(() => {
      return Promise.all([
        knex('garage_items').insert([
        {
          item: 'stuffed grizzly bear',
          reason: 'family favorite',
          cleanliness: 'dusty'
        },
        {
          item: 'bike',
          reason: 'classic',
          cleanliness: 'sparkling'
        },
        {
          item: 'baby clothes',
          reason: 'mom is attached',
          cleanliness: 'rancid'
        }
      ])
      .then(() => console.log('Seeding Complete!'))
      .catch(error => console.log({ error }))
    ])
  })
    .catch(error => ({ error }));
};
