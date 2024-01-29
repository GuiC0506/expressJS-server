const pool = require("./db");

const createUserSchema = `
    create table if not exists users(
        id serial primary key,
        name varchar(30) not null,
        display_name varchar(30) not null,
        password varchar(30) not null
    );
`;

async function createSchemas() {
    try {
        await pool.query(createUserSchema);
    } catch(err) {
        console.log(err);
    }
}

createSchemas();

