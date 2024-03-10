import styles from './styles/ButtonRenamePlayList.module.css';

function ButtonRenamePlayList({ handleRenameClick, text }) {
  return (
    <button
      onClick={handleRenameClick}
      className={styles['btn__rename-playlist']}
    >
      {text}
    </button>
  );
}

export default ButtonRenamePlayList;
