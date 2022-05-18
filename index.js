const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjcvj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    await client.connect();
    // console.log('database connected');
    const todoCollection = client.db('todo-app').collection('todos');

    app.get('/todos', async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const todos = await cursor.toArray();
      res.send(todos);
    });

    app.post('/todo', async (req, res) => {
      const newTodo = req.body;
      const result = await todoCollection.insertOne(newTodo);

      res.send(result);
    });

    app.delete('/todos/:todoId', async (req, res) => {
      const id = req.params.todoId;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);

      res.send(result);
    });

  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('todo app running');
});

app.listen(port, () => {
  console.log(`Todo app listening ${port}`);
});
