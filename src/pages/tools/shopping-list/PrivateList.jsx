import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebase } from "../../../firebase.js";

export default function PrivateList({ listId }) {
  const { auth, db } = useMemo(() => getFirebase(), []);
  const [authReady, setAuthReady] = useState(false);
  const [uid, setUid] = useState(null);
  // undefined = still loading, null = no request made yet,
  // { email, status } = a request doc exists
  const [access, setAccess] = useState(undefined);
  const [items, setItems] = useState([]);
  const [itemsError, setItemsError] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [text, setText] = useState("");

  // Silent anonymous sign-in — no popup, no account for family members to
  // create. Firestore rules key everything off this auth.uid.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUid(u.uid);
        setAuthReady(true);
      } else {
        signInAnonymously(auth).catch(() => setAuthReady(true));
      }
    });
    return unsub;
  }, [auth]);

  // Live-listen to our own access-request doc. This is what makes approval
  // feel instant: flip `status` to "approved" in the console and this page
  // updates on its own, no refresh needed.
  useEffect(() => {
    if (!uid) return undefined;
    const ref = doc(db, "lists", listId, "access", uid);
    const unsub = onSnapshot(
      ref,
      (snap) => setAccess(snap.exists() ? snap.data() : null),
      () => setAccess(null),
    );
    return unsub;
  }, [uid, db, listId]);

  useEffect(() => {
    if (access?.status !== "approved") return undefined;
    setItemsError(null);
    const q = query(
      collection(db, "lists", listId, "items"),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(
      q,
      (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) =>
        setItemsError(
          err.code === "permission-denied"
            ? "You don't have access to this list."
            : "Something went wrong loading this list.",
        ),
    );
    return unsub;
  }, [access, db, listId]);

  async function requestAccess(e) {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed || !uid) return;
    await setDoc(doc(db, "lists", listId, "access", uid), {
      email: trimmed,
      status: "pending",
      requestedAt: serverTimestamp(),
    });
  }

  async function addItem(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      await addDoc(collection(db, "lists", listId, "items"), {
        text: trimmed,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch {
      setItemsError("You don't have permission to add items to this list.");
    }
  }

  async function toggleItem(item) {
    try {
      await updateDoc(doc(db, "lists", listId, "items", item.id), {
        completed: !item.completed,
      });
    } catch {
      setItemsError("You don't have permission to edit this list.");
    }
  }

  async function removeItem(item) {
    try {
      await deleteDoc(doc(db, "lists", listId, "items", item.id));
    } catch {
      setItemsError("You don't have permission to edit this list.");
    }
  }

  if (!authReady || access === undefined) {
    return <p className="shopping__loading">Loading…</p>;
  }

  if (!access) {
    return (
      <div className="shopping shopping--gate">
        <p>Enter your email to request access to this list.</p>
        <form className="shopping__request-form" onSubmit={requestAccess}>
          <input
            type="email"
            required
            className="shopping__input"
            placeholder="you@example.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button type="submit" className="shopping__signin-btn">
            Request access
          </button>
        </form>
      </div>
    );
  }

  if (access.status === "pending") {
    return (
      <div className="shopping shopping--gate">
        <p>
          Access requested for <strong>{access.email}</strong>.
        </p>
        <p className="shopping__hint">
          Waiting for approval — this page updates on its own once you're
          approved, no need to refresh.
        </p>
      </div>
    );
  }

  if (access.status !== "approved") {
    return (
      <div className="shopping shopping--gate">
        <p>Access wasn't approved for {access.email}.</p>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="shopping shopping--gate">
        <p>{itemsError}</p>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
  );

  return (
    <div className="tool shopping">
      <p className="shopping__signed-in-as">Approved as {access.email}</p>

      <div className="shopping__list-area">
        {sorted.length === 0 ? (
          <p className="shopping__empty">The list is empty.</p>
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
                    checked={!!item.completed}
                    onChange={() => toggleItem(item)}
                  />
                  <span>{item.text}</span>
                </label>

                <button
                  type="button"
                  className="shopping__remove-btn"
                  aria-label={`Remove ${item.text}`}
                  onClick={() => removeItem(item)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="shopping__add-row" onSubmit={addItem}>
        <input
          type="text"
          className="shopping__input"
          placeholder="Add an item…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit" className="shopping__add-btn">
          Add
        </button>
      </form>
    </div>
  );
}
