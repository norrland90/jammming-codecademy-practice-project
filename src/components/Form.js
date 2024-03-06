import { useState } from 'react';
import ButtonPrimary from './ButtonPrimary';
import styles from './styles/Form.module.css';

function Form() {
  const [input, setInput] = useState('');

  function handleInput({ target }) {
    setInput(target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.form__input}
        placeholder="Enter song, album or artist"
        id="search"
        onChange={handleInput}
        value={input}
      />
      <ButtonPrimary type="search" text="Search" />
    </form>
  );
}

export default Form;
