import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchNotes, deleteNote, createNote } from "../../services/noteService";
import type { CreateNoteParams } from "../../services/noteService";
import { useDebouncedCallback } from "use-debounce";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";
import Loader from "../Loader/Loader";

function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const perPage = 12;
  const queryClient = useQueryClient();

  const changeSearchDebounced = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 1000);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    changeSearchDebounced(value);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, search: debouncedSearch, perPage }),
  });
  const { mutate: deleteNoteMutation } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const { mutate: createNoteMutation } = useMutation({
    mutationFn: (newNote: CreateNoteParams) => createNote(newNote),
    onSuccess: () => {
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage message="Error loading notes! Please try again later." />
      )}

      {!isLoading && !isError && data?.notes.length === 0 && (
        <EmptyState message="No notes found. Create one!" />
      )}
      {!isLoading && !isError && (
        <NoteList items={data?.notes ?? []} onDelete={deleteNoteMutation} />
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={(values) => {
              createNoteMutation(values);
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
