import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("scores").del();

    let userId = await knex.select('id').from('users').first()
    let userId2 = (await knex.select('id').from('users'))[1]
    let mediaId = await knex.select('id').from('media').first()
    let mediaId2 = (await knex.select('id').from('media'))[1]
    let mediaId3 = (await knex.select('id').from('media'))[2]
    let mediaId4 = (await knex.select('id').from('media'))[3]
    // Inserts seed entries
    await knex("scores").insert([
        { scores: 1000, user_id: userId.id, media_id: mediaId.id },
        { scores: 2000, user_id: userId.id, media_id: mediaId2.id },
        { scores: 3000, user_id: userId.id, media_id: mediaId3.id },
        { scores: 4000, user_id: userId2.id, media_id: mediaId.id },
        { scores: 5000, user_id: userId2.id, media_id: mediaId4.id }
    ]);
};
