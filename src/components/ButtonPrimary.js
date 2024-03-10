import styles from './styles/ButtonPrimary.module.css';

function ButtonPrimary({ type, text, blinkClass, onClick = null }) {
  return (
    <button
      className={`${styles.btn__primary} ${styles[`btn__primary--${type}`]} ${
        styles[blinkClass]
      }
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default ButtonPrimary;
