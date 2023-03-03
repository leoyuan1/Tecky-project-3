import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("media").del();

    // Inserts seed entries
    await knex("media").insert([
        { song_name: "After LIKE", image: "after_like.jpeg", video: "/test_video/test1.mp4", pose_data: 'test1_wb_data.json', start_time: 0, end_time: 176 },
        { song_name: "Attention", image: "attention.jpeg", video: "/test_video/test2.mp4", pose_data: 'test2_wb_data.json', start_time: 0, end_time: 177 },
        { song_name: "Ditto", image: "ditto.jpeg", video: "/test_video/test3.mp4", pose_data: 'test3_wb_data.json', start_time: 0, end_time: 186 },
        { song_name: "Baby Shark Easy", image: "baby-shark-1.gif", video: "/test_video/baby_shark_easy.mp4", pose_data: 'baby_shark_easy_wb_data.json', start_time: 25, end_time: 75 },
        { song_name: "Baby Shark Difficult", image: "baby-shark-2.gif", video: "/test_video/baby_shark_difficult.mp4", pose_data: 'baby_shark_difficult_wb_data.json', start_time: 15, end_time: 136 }]);
};
