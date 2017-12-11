exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('Name', (t) => {
      t.increments('id').primary()

      t.timestamps(true, true)
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('Name')
  ])
}