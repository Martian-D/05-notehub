import { useFormik, ErrorMessage, FormikProvider } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { CreateNoteParams } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const NoteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long (max 50)!")
    .required("Title is required"),
  content: Yup.string().max(500, "Content is too long (max 500)!"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createNoteMutation } = useMutation({
    mutationFn: (newNote: CreateNoteParams) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const formik = useFormik<CreateNoteParams>({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema: NoteValidationSchema,
    onSubmit: (values) => {
      createNoteMutation(values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <form className={css.form} onSubmit={formik.handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            className={css.input}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            id="tag"
            name="tag"
            className={css.select}
            value={formik.values.tag}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>

          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={formik.isSubmitting}
          >
            Create note
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}

export default NoteForm;
