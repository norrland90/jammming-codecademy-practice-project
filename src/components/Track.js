import styles from './styles/Track.module.css';
import ButtonAddRemove from './ButtonAddRemove';
import fallBackImgUrl from '../assets/no-image-icon.png';

function Track({ list, track, onAction, jiggleTrackId }) {
  return (
    <div
      className={`${styles.track} ${
        track.id === jiggleTrackId && list !== 'results' ? styles.jiggle : ''
      }`}
    >
      <div className={styles['track__img-text-container']}>
        <img
          className={styles.track__img}
          src={
            track.album.images[2] ? track.album.images[2].url : fallBackImgUrl
          }
          alt=""
        />
        <div className={styles['track__text-container']}>
          <h3 className={styles.track__name}>{track.name}</h3>
          <span className={styles.track__artist}>
            {track.artists[0].name} |{' '}
          </span>
          <span className={styles.track__album}>{track.album.name}</span>
        </div>
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
