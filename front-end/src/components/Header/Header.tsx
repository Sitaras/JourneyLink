import React from "react";
import UserNav from "@/components/Header/UserNav/UserNav";
import Link from "next/link";

import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">Share the Ride</Link>
      <UserNav className="ml-auto" />
    </header>
  );
};

export default Header;
