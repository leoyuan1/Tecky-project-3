import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('scores', (table) => {
        table.increments();
        table.integer('scores');
        table.integer('user_id');
        table.foreign('user_id').references('users.id');
        table.integer('media_id');
        table.foreign('media_id').references('media.id');
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('scores')
}

