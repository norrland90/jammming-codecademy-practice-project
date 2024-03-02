import styles from './styles/Track.module.css';
import ButtonAddRemove from './ButtonAddRemove';

function Track({ list }) {
  return (
    <div className={styles.track}>
      <div className={styles['track__text-container']}>
        <h3 className={styles.track__name}>Example Track Name</h3>
        <p className={styles['track__artist-album']}>
          <span className={styles.artist}>Example Track Artist | </span>Example
          Track Album<span className={styles.album}></span>
        </p>
      </div>
      <ButtonAddRemove type={list === 'results' ? 'add' : 'remove'} />
    </div>
  );
}

export default Track;
