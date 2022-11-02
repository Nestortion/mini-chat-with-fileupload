import styles from "../styles/Form.module.css";

export default function Form() {
  return (
    <div>
      <form>
        <div className={styles.cringe}>
          <label htmlFor="file">Saussy</label>
          <input type="file" id="file" />
          <input type="text" />
        </div>
      </form>
    </div>
  );
}
