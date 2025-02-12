"use client";
import { useState, useEffect } from "react";
import { FaTrashAlt, FaPlusCircle, FaEdit } from "react-icons/fa"; // Added Edit icon

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null); // State for editing Todo

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    const newTodo = await response.json();
    setTodos([...todos, newTodo]);
    setTitle("");
  };

  const handleDelete = async (id) => {
    const response = await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
    } else {
      console.error("Failed to delete todo");
    }
  };

  const handleEdit = (id, currentTitle) => {
    setEditingId(id);
    setTitle(currentTitle);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: editingId, title }),
    });

    const updatedTodo = await response.json();

    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, title: updatedTodo.title } : todo
      )
    );

    setEditingId(null);
    setTitle("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex justify-center items-center px-4 py-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8 text-shadow-lg">
          My Todo List
        </h1>

        <form
          onSubmit={editingId ? handleUpdate : handleSubmit}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new task..."
            className="w-full md:w-2/3 border-2 border-indigo-400 rounded-lg px-6 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 mt-4 md:mt-0 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-lg shadow-xl"
          >
            <FaPlusCircle className="inline-block mr-2 text-2xl" />
            {editingId ? "Update Todo" : "Add Todo"}
          </button>
        </form>

        <ul className="space-y-6">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border-2 border-indigo-200 rounded-xl shadow-lg"
            >
              <span className="text-xl font-medium text-gray-700 mb-2 sm:mb-0">
                {todo.title}
              </span>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleEdit(todo.id, todo.title)}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-md shadow-md"
                >
                  <FaEdit className="text-xl" />
                </button>

                <button
                  onClick={() => handleDelete(todo.id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-md shadow-md"
                >
                  <FaTrashAlt className="text-xl" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
