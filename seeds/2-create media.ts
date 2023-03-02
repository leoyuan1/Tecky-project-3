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
        { song_name: "Test 1", image: "slider-2.jpg", video: "/test_video/test1.mp4" },
        { song_name: "Test 2", image: "slider-2.jpg", video: "/test_video/test2.mp4" },
        { song_name: "Test 3", image: "slider-2.jpg", video: "/test_video/test3.mp4" },
        { song_name: "Baby Shark Easy", image: "baby-shark-1.gif", video: "/test_video/baby_shark_easy.mp4" },
        { song_name: "Baby Shark Difficult", image: "baby-shark-2.gif", video: "/test_video/baby_shark_difficult.mp4" }]);
};
