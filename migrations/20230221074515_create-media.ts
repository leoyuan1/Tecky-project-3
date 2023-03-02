import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('media', (table) => {
        table.increments();
        table.string('song_name').unique;
        table.string('image');
        table.string('video');
        table.string('pose_data');
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('media')
}

