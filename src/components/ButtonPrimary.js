import styles from './styles/ButtonPrimary.module.css';

function ButtonPrimary({ type, text }) {
  return (
    <button
      className={`${styles.btn__primary} ${styles[`btn__primary--${type}`]}`}
    >
      {text}
    </button>
  );
}

export default ButtonPrimary;
