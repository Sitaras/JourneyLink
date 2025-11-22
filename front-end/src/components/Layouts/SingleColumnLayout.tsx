import styles from "./SingleColumnLayout.module.scss";

const SingleColumnLayout = ({
  children,
  containerClass = "",
  mainClass = "",
}: {
  children: React.ReactNode;
  containerClass: string;
  mainClass: string;
}) => {
  return (
    <>
      <section className={`${styles.container} ${containerClass}`}>
        <main className={`${styles.column} ${mainClass}`}>{children}</main>
      </section>
    </>
  );
};

export default SingleColumnLayout;
