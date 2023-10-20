import { useEffect, useState } from "react";
import { RxDocument } from "rxdb";
import db from "../../../database";
import { TodoDoc } from '../../../database/schemas/todo.schema';
import { generateUniqueId } from '../../../utils';
import TodoItem from "./TodoItem";

export default function Todos() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<RxDocument<TodoDoc>[]>([]);

  useEffect(() => {
    const sub = db.todos.find().$.subscribe((todos) => {
      if (!todos) {
        return;
      }
      console.log("reload todo-list ");
      setTodos(todos);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;

    await db.todos.insert({
      id: generateUniqueId(),
      name: text,
      done: false,
    });

    setText("");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <header>
        <h1>Todos</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>

      <div>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
