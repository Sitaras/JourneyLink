import { LoadingSpinner } from "../ui/loading-spinner";
import styles from "./ScreenLoader.module.css";

export default function ScreenLoader() {
  return (
    <div className={styles.box}>
      <LoadingSpinner />
    </div>
  );
}
