import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Form from './components/Form';
import Track from './components/Track';
import ButtonPrimary from './components/ButtonPrimary';
import ButtonRenamePlayList from './components/ButtonRenamePlayList';
import RenameInput from './components/RenameInput';

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [trackList, setTrackList] = useState([]);
  const [playList, setPlayList] = useState([]);
  const [playListName, setPlayListName] = useState('New Playlist');
  const [isRenaming, setIsRenaming] = useState(false);
  const [jiggleTrackId, setJiggleTrackId] = useState(null);
  const inputRef = useRef(null);

  // Workaround to check login status - not good
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('access_token');
      if (loggedInStatus) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };

    // Run every second to check login status
    const IntervalId = setInterval(checkLoginStatus, 1000);

    // Clear the interval when the component unmounts (i.e. button changes)
    return () => {
      clearInterval(IntervalId);
    };
  }, []);

  function addTrackToPlayList(track) {
    setPlayList((currentList) => {
      // Check if the track already exists in the playlist
      const trackExists = currentList.some((item) => item.id === track.id);

      // If the track does not exist, add it to the playlist
      if (!trackExists) {
        return [...currentList, track];
      } else {
        setJiggleTrackId(track.id);
        setTimeout(() => setJiggleTrackId(null), 1000); // Reset after 1 second
      }

      // If the track already exists, return the current playlist
      return currentList;
    });
  }

  function removeTrackFromPlayList(track) {
    setPlayList((currentList) => {
      return currentList.filter((item) => item.id !== track.id);
    });
  }

  function handleRenameClick() {
    if (!isRenaming) {
      setIsRenaming(true);
    } else {
      setIsRenaming(false);
    }
  }

  function handleNewPlayListName(e, newName) {
    e.preventDefault();
    if (!newName) return;
    setPlayListName(newName);
    setIsRenaming(false);
  }

  return (
    <>
      <Header />
      <main>
        <Form
          loggedIn={loggedIn}
          trackList={trackList}
          setTrackList={setTrackList}
        />
      </main>
      <div className="results-container container">
        <section className="results-playlist-box">
          <div className="results-playlist__heading-container">
            <h2 className="results-playlist__heading">Results</h2>
          </div>
          {trackList.map((track) => {
            return (
              <Track
                list="results"
                track={track}
                key={track.id}
                onAction={addTrackToPlayList}
                jiggleTrackId={jiggleTrackId}
              />
            );
          })}
        </section>
        <section className="results-playlist-box">
          <div className="results-playlist__heading-container">
            {isRenaming ? (
              <RenameInput onSubmit={handleNewPlayListName} />
            ) : (
              <h2 className="results-playlist__heading">{playListName}</h2>
            )}
            <ButtonRenamePlayList
              handleRenameClick={handleRenameClick}
              text={isRenaming ? 'Cancel' : 'Rename'}
            />
          </div>
          {playList.map((track) => {
            return (
              <Track
                list="playlist"
                track={track}
                key={track.id}
                onAction={removeTrackFromPlayList}
                jiggleTrackId={jiggleTrackId}
              />
            );
          })}
          <ButtonPrimary type="save" text="Save playlist" />
        </section>
      </div>
    </>
  );
}

export default App;
