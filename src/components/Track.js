import styles from './styles/Track.module.css';
import ButtonAddRemove from './ButtonAddRemove';

function Track({ list, track, onAction, jiggleTrackId }) {
  return (
    <div
      className={`${styles.track} ${
        track.id === jiggleTrackId && list !== 'results' ? styles.jiggle : ''
      }`}
    >
      <div className={styles['track__text-container']}>
        <h3 className={styles.track__name}>{track.name}</h3>
        <p className={styles['track__artist-album']}>
          <span className={styles.artist}>{track.artists[0].name} | </span>
          <span className={styles.album}>{track.album.name}</span>
        </p>
      </div>
      <ButtonAddRemove
        type={list === 'results' ? 'add' : 'remove'}
        onAction={onAction}
        track={track}
      />
    </div>
  );
}

export default Track;
