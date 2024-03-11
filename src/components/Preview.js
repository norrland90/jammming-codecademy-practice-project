import { useState, useEffect } from 'react';
import { FaCirclePlay } from 'react-icons/fa6';
import { FaCirclePause } from 'react-icons/fa6';
import styles from './styles/Preview.module.css';

function Preview({ track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(new Audio(track.preview_url));
  }, [track]);

  function handlePreviewButtonClick() {
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  return (
    <>
      <button
        className={styles.preview__btn}
        onClick={handlePreviewButtonClick}
      >
        {isPlaying ? (
          <FaCirclePause className={styles['preview-btn-icon']} />
        ) : (
          <FaCirclePlay className={styles['preview-btn-icon']} />
        )}
      </button>
    </>
  );
}

export default Preview;
