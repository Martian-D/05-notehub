import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  items: Note[];
  onDelete: (id: string) => void;
}

function NoteList({ items, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {items.map((item) => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <button className={css.button} onClick={() => onDelete(item.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
