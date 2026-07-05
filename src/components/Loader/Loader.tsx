import css from "./Loader.module.css";

function Loader() {
  return (
    <div className={css.wrapper}>
      <div className={css.spinner}></div>
      <p className={css.text}>Loading notes...</p>
    </div>
  );
}

export default Loader;
