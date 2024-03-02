import styles from './styles/ButtonAddRemove.module.css';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';

function ButtonAddRemove({ type }) {
  return (
    <button className={styles['btn__add-remove-track']}>
      {type === 'add' ? <FaPlus /> : <FaMinus />}
    </button>
  );
}

export default ButtonAddRemove;
