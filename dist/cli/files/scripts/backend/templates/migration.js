"use strict";
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('Name', function (t) {
            t.increments('id').primary();
            t.timestamps(true, true);
        })
    ]);
};
exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('Name')
    ]);
};
