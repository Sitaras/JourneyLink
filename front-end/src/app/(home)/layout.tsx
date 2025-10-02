import Header from "@/components/Header/Header";

import styles from "./layout.module.css";

export const HomeLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
      <main className={styles.page}>
        <div className={styles.container}>
          <Header />
          <main className={styles.main}>{children}</main>
        </div>
      </main>
  );
};

export default HomeLayout;
