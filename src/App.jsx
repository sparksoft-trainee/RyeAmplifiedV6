import { Amplify } from "aws-amplify";

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "./amplifyconfiguration.json";
Amplify.configure(config);

import { useEffect, useState } from "react";

import { generateClient } from "aws-amplify/api";

import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";

import Crud from "./crud/CRUD";

const initialState = { name: "", description: "" };
const client = generateClient();


Amplify.configure({
  API: {
    GraphQL: {
      endpoint:
        "https://ji3hlozhlnhi5lkl5mtqbw426q.appsync-api.ap-southeast-1.amazonaws.com/graphql",
      region: "ap-southeast-1",
      defaultAuthMode: "apiKey",
      apiKey: "da2-2uqsf5uv2zgkdc4c2piyalw6he",
    },
  },
});

export function App({ signOut }) {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos,
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await client.graphql({
        query: createTodo,
        variables: {
          input: todo,
        },
      });
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginLeft: "0em",
          marginRight: "0em",
          background: "indigo",
          width: "100%",
        }}
      >
        <h1 style={{ marginLeft: "1em", color: "aliceblue" }}>
          Welcome to Rye Technologies
        </h1>
        <button
          onClick={signOut}
          style={{ height: "90%", marginRight: "2em", marginTop: "0.75em" }}
        >
          Sign out
        </button>
      </div>

      <div style={styles.container}>
        <h2>Amplify Todos</h2>
        <input
          onChange={(event) => setInput("name", event.target.value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={(event) => setInput("description", event.target.value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
        <button style={styles.button} onClick={addTodo}>
          Create Todo
        </button>
        {todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
          </div>
        ))}
      </div>
      <div>
        <Crud />
      </div>
      <button
        onClick={refreshPage}
        style={{ marginTop: "5em", marginLeft: "10em" }}
      >
        Click here to Write a Memory
      </button>
      <div
        id="formio"
        style={{
          width: "80%",
          marginLeft: "10em",
          marginTop: "1em",
          background: "purple",
          padding: "1em",
          color: "aliceblue",
          marginBottom: "5em",
        }}
      ></div>

    </>
  );
}

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

const AppWithAuthenticator = withAuthenticator(App);
export default AppWithAuthenticator;
