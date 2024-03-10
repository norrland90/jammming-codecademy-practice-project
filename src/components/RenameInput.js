import styles from './styles/RenameInput.module.css';
import { useState } from 'react';

function RenameInput({ onSubmit }) {
  const [input, setInput] = useState('');

  function handleInput({ target }) {
    setInput(target.value);
  }

  return (
    <form
      className={styles.rename__form}
      onSubmit={(e) => {
        onSubmit(e, input);
      }}
    >
      <input
        className={styles.rename__input}
        type="test"
        onChange={handleInput}
        value={input}
        placeholder="Enter new name"
      />
      <button className={styles['btn__rename-playlist']}>Submit</button>
    </form>
  );
}

export default RenameInput;
