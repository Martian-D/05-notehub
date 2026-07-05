import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { keepPreviousData } from "@tanstack/react-query";
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
    placeholderData: keepPreviousData,
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

      {!isLoading && !isError && <NoteList items={data?.notes ?? []} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default App;
