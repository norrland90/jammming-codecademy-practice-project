import './App.css';
import Header from './components/Header';
import Form from './components/Form';
import Track from './components/Track';
import ButtonPrimary from './components/ButtonPrimary';

function App() {
  return (
    <>
      <Header />
      <main>
        <Form />
      </main>
      <div className="results-container container">
        <section class="results-playlist-box">
          <h2 class="results-playlist__heading">Results</h2>
          <Track list="results" />
          <Track list="results" />
        </section>
        <section class="results-playlist-box">
          <h2 class="results-playlist__heading">New Playlist</h2>
          <Track list="playlist" />
          <ButtonPrimary type="save" text="Save playlist" />
        </section>
      </div>
    </>
  );
}

export default App;
