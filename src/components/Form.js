import { useState } from 'react';
import ButtonPrimary from './ButtonPrimary';
import styles from './styles/Form.module.css';
import { redirectToSpotifyAuthorize, getSearchResults } from '../utils/Spotify';

function Form({ loggedIn, trackList, setTrackList }) {
  const [input, setInput] = useState('');

  function handleInput({ target }) {
    setInput(target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!loggedIn) {
      redirectToSpotifyAuthorize();
    } else {
      getSearchResults(input).then((data) => {
        setTrackList(data.tracks.items);
        console.log(trackList);
      });
    }
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
      {loggedIn ? (
        <ButtonPrimary type="search" text="Search" />
      ) : (
        <ButtonPrimary type="search" text="Login to search" />
      )}
      {/* <ButtonPrimary type="search" text="Search" /> */}
    </form>
  );
}

export default Form;
