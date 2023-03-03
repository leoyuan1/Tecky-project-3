import { Knex } from "knex";
import { hashPassword } from "../util/bcrypt";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { email: "123@gmail.com", password: await hashPassword('123'), username: "Peter", icon: "" },
        { email: "456@gmail.com", password: await hashPassword('456'), username: "Tony", icon: "" },
        { email: "789@gmail.com", password: await hashPassword('789'), username: "Ryan", icon: "" }
    ]);
};
