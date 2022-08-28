import React, { useEffect, useState } from "react";
import { IAddTodos, ITodos } from "../interface";

const url: string = "https://graphqlzero.almansi.me/api";

const makeRequest: Function = async (query: string) => {
  const data = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const res = await data.json();

  return res;
};

const TodosList: React.FC = () => {
  const [todos, setTodos] = useState<ITodos[]>([]);
  const [addTodo, setAddTodo] = useState<String>("");
  const [searchTodo, setSearchTodo] = useState<String>("");

  useEffect(() => {
    const requset = async () => {
      const data = await makeRequest(`query AllTodo{
            todos{
              data{
                id
                title
                completed
                user{
                  name
                }
              }
            }
          }`);

      setTodos(data.data.todos.data);
    };

    requset();
  }, []);

  const createTodo: Function = async () => {
    if (addTodo) {
      const mutation = `mutation createTodo{
        createTodo(input: {title: "${addTodo}", completed: false} ){
          title
          id
          completed
          user{
            name
          }
        }
      }`;

      const todo: IAddTodos = await makeRequest(mutation);

      setTodos([todo.data.createTodo, ...todos]);
    }
  };

  const search: Function = async () => {
    if (searchTodo) {
      const seactQuery = `query searchQuery{
        todos(options: {search: {q: "${searchTodo}"}}){
          data{
            id
            title
            completed
            user{
              name
            }
          }
        }
      }`;

      const searchTodoList = await makeRequest(seactQuery);

      setTodos(searchTodoList.data.todos.data);
    }
  };

  const deleteTodo: Function = async (e: HTMLLIElement) => {
    const seactQuery = `mutation DeleteTodo{
      deleteTodo(id: "${e.id}")
    }`;

    await makeRequest(seactQuery);

    const newTodos = todos?.filter((todo: ITodos) => +todo.id !== +e.id);
    setTodos(newTodos);
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="add-bar">
          <p>Add Todo</p>
          <input
            placeholder="write todo"
            onChange={(e) => {
              setAddTodo(e.target.value);
            }}
          />
          <button onClick={() => createTodo()}>Add</button>
        </div>
        <div className="search-bar">
          <p>Search Todo</p>
          <input
            placeholder="write todo and search"
            onChange={(e) => setSearchTodo(e.target.value)}
          />
          <button onClick={() => search()}>Search</button>
        </div>
      </div>
      {todos?.length !== 0 && (
        <ul className="todos">
          {todos?.map((todo: ITodos) => (
            <li
              key={todo.id}
              id={`${todo.id}`}
              className="todo"
              onClick={(e) => deleteTodo(e.target)}
            >
              {todo.title} | by {todo.user.name} {todo.completed ? "🟢" : "🔴"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodosList;
