import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("media").del();

    // Inserts seed entries
    await knex("media").insert([
        { song_name: "song1", image: "slider-1.jpg", video: "123.mp4" },
        { song_name: "song2", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song3", image: "slider-1.jpg", video: "123.mp4" },
        { song_name: "song4", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song5", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song6", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song7", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song8", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song9", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song10", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song11", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song12", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song13", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song14", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song15", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song16", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song17", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song18", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song19", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song20", image: "slider-2.jpg", video: "123.mp4" },
        { song_name: "song21", image: "slider-2.jpg", video: "123.mp4" }]);
};
