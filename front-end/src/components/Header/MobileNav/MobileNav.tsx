import React from "react";
import Link from "next/link";
import { Home, PanelLeft, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import styles from "./MobileNav.module.css";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className={styles.sheetContainer}>
          <Link href="#" className={styles.sheetLink}>
            <Home className="h-5 w-5" />
            Login
          </Link>
          <Link href="#" className={styles.sheetLink}>
            <ShoppingCart className="h-5 w-5" />
            Register
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
