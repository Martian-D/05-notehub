import css from "./EmptyState.module.css";

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return <div className={css.empty}>{message}</div>;
}

export default EmptyState;
