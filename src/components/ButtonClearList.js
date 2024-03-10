import styles from './styles/ButtonRenamePlayList.module.css';

function ButtonClearList({ onClick, text }) {
  return (
    <button
      onClick={onClick}
      className={`${styles['btn__rename-playlist']} ${styles.clear}`}
    >
      {text}
    </button>
  );
}

export default ButtonClearList;
