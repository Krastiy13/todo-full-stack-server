import express from "express";
import {
    getTodo,
    getSharedTodoByID,
    getUserById,
    getUserByEmail,
    createTodo,
    deletteTodo,
    toggleCompleted,
    shareTodo,
    getTodosById
} from "./database.js"
import cors from "cors"

// const corsOption = {
//     origin: "exp://192.168.1.160:8081",
//     methods: ["POST", "GET"],
//     credential: true
// }
const app = express();
app.use(express.json());
app.use(cors());


app.get("/todos/:id", async (req, res) => {
    const todos = await getTodosById(req.params.id)
    res.status(200).send(todos)
})
app.get("/todos/shared_todos/:id", async (req, res) => {

    const todoID = await getSharedTodoByID(req.params.id);


    console.log(todoID, "id de la tarea")
    const author = await getUserById(todoID.user_id);
    const shared_with = await getUserById(todoID.shared_with_id);
    res.status(200).send({ author, shared_with })

})
app.get("/users/:id", async (req, res) => {
    const user = await getUserById(req.params.id);
    res.status(200).send(user)
})

app.put("/todos/:id", async (req, res) => {
    const { value } = req.body

    const todo = await toggleCompleted(req.params.id, value)
    res.status(200).send(todo);
})
app.delete("/todos/:id", async (req, res) => {
    await deletteTodo(req.params.id);
    res.status(200).send({ message: "Todo deleted successfully" });
})

app.post("/todos/shared_todos", async (req, res) => {
    const { todo_id, user_id, email } = req.body

    const userToShare = await getUserByEmail(email);

    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).send(sharedTodo);
})
app.post("/todos", async (req, res) => {
    const { user_id, title } = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
})
const puerto = 3000
app.listen(puerto, () => {
    console.log(`server running in port ${puerto}`)
})