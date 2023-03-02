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
        { song_name: "Test 1", image: "slider-2.jpg", video: "/test_video/test1.mp4", pose_data: 'test1_wb_data.json' },
        { song_name: "Test 2", image: "slider-2.jpg", video: "/test_video/test2.mp4", pose_data: 'test2_wb_data.json' },
        { song_name: "Test 3", image: "slider-2.jpg", video: "/test_video/test3.mp4", pose_data: 'test3_wb_data.json' },
        { song_name: "Baby Shark Easy", image: "baby-shark-1.gif", video: "/test_video/baby_shark_easy.mp4", pose_data: 'baby_shark_easy_wb_data.json' },
        { song_name: "Baby Shark Difficult", image: "baby-shark-2.gif", video: "/test_video/baby_shark_difficult.mp4", pose_data: 'baby_shark_difficult_wb_data.json' }]);
};
