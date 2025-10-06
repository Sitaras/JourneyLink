import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// DEPRECATED NOT USED ANYWHERE

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">JourneyLink</Link>
      </div>
      <nav className={styles.nav} style={{marginRight:"1.5%"}}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className={styles.dropdownTrigger}>
              Log In/Register
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/login">Log In</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/register">Register</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/settings">Settings</Link>
        <Link href="/support">Support</Link>

      </nav>
    </header>
  );
};

export default Header;