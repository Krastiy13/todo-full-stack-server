import mysql from "mysql2";
import dotenv from "dotenv"
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})
    .promise();

export const getTodosById = async (id) => {

    const [rows] = await pool.query(
        `SELECT todos.* , shared_todos.shared_with_id
        FROM todos
        LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
        WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?`,
        [id, id]);
    return rows;
}


export const getTodo = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM  todos WHERE id = ? `, [id]

    );
    return rows[0]
}

export const getSharedTodoByID = async (id) => {

    const [rows] = await pool.query(
        `SELECT * FROM shared_todos WHERE todo_id = ?`,
        [id]
    )

    return rows[0]
}
export const getUserById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0]
}


export const getUserByEmail = async (correo) => {

    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ${correo}`);
    return rows[0]
}



export const createTodo = async (user_id, title) => {

    const [result] = await pool.query(`INSERT INTO todos (user_id,title)
    VALUES (?,?)`, [user_id, title]
    );
    const todoID = result.insertId;
    return getTodo(todoID)

}


export const deletteTodo = async (id) => {
    const [results] = await pool.query(
        `
        DELETE FROM todos WHERE id = ?`,
        [id]
    );
    return results

}

export const toggleCompleted = async (id, value) => {

    const newValue = value === true ? "TRUE" : "FALSE";

    const [results] = await pool.query(
        `
        UPDATE todos
        SET completed = ${newValue}
        WHERE id = ?
        `, [id]
    );
    return results;

}

export const shareTodo = async (todo_id, user_id, shared_with_id) => {

    console.log(shared_with_id)

    const results = await pool.query(`
    INSERT INTO shared_todos (todo_id,user_id,shared_with_id)
    VALUES (?,?,?)
    `, [todo_id, user_id, shared_with_id]);

    return results.insertId


}








