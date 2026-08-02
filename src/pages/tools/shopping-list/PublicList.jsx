import { useEffect, useState } from "react";

const STORAGE_KEY = "shoppingList.items";

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function PublicList() {
  const [items, setItems] = useState(loadItems);
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
    ]);
    setText("");
  }

  function toggleItem(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCompleted() {
    setItems((prev) => prev.filter((item) => !item.completed));
  }

  const hasCompleted = items.some((item) => item.completed);
  const sorted = [...items].sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) || a.createdAt - b.createdAt,
  );

  return (
    <div className="tool shopping">
      <div className="shopping__list-area">
        {sorted.length === 0 ? (
          <p className="shopping__empty">Your list is empty.</p>
        ) : (
          <ul className="shopping__list" role="list">
            {sorted.map((item) => (
              <li
                key={item.id}
                className={`shopping__item ${item.completed ? "is-done" : ""}`}
              >
                <label className="shopping__item-label">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span>{item.text}</span>
                </label>

                <button
                  type="button"
                  className="shopping__remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasCompleted && (
        <button
          type="button"
          className="shopping__clear-btn"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}

      <form className="shopping__add-row" onSubmit={addItem}>
        <input
          className="shopping__input"
          value={text}
          placeholder="Add an item…"
          onChange={(e) => setText(e.target.value)}
        />

        <button className="shopping__add-btn" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
