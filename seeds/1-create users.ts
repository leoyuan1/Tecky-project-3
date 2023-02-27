import { Knex } from "knex";
import { hashPassword } from "../util/bcrypt";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { email: "123@gmail.com", password: await hashPassword('123'), username: "123", icon: "" },
        { email: "456@gmail.com", password: await hashPassword('456'), username: "456", icon: "" },
        { email: "789@gmail.com", password: await hashPassword('789'), username: "789", icon: "" }
    ]);
};
