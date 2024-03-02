import styles from './styles/Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__heading}>
        Ja
        <span
          className={`${styles.header__heading} ${styles['header__heading--accent']}`}
        >
          mmm
        </span>
        ing
      </h1>
    </header>
  );
}

export default Header;
