import Header from "@/components/Header/Header";
import Providers from "./providers";

import styles from "./layout.module.css";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Providers>
      <main className={styles.page}>
        <div className={styles.container}>
          <Header />
          <main className={styles.main}>{children}</main>
        </div>
      </main>
    </Providers>
  );
};

export default DashboardLayout;
