import React from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineMenu } from "react-icons/ai"; // Importing menu icon from react-icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

const UserMenu = ({ className }: { className?: string }) => {
  const user = null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("overflow-hidden rounded-full", className)}
        >
          {/* Replace the Image with a Menu Icon Button */}
          <AiOutlineMenu size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Link href="/settings">Settings</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href="/support">Support</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem>
            <form
              action={async () => {
                "use server";
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem>
              <Link href="/login">Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/register">Register</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
