import type { Note, NoteTag } from "../types/note";
import axios from "axios";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const noteInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await noteInstance.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
    },
  });
  return response.data;
};
export const createNote = async ({
  title,
  content,
  tag,
}: CreateNoteParams): Promise<Note> => {
  const { data } = await noteInstance.post<Note>("/notes", {
    title,
    content,
    tag,
  });
  return data;
};

export const deleteNote = async (noteId: Note["id"]): Promise<Note> => {
  const { data } = await noteInstance.delete<Note>(`/notes/${noteId}`);
  return data;
};
