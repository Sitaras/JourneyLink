"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthClient";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { routes } from "@/configs/routes";
import { Trans } from "@lingui/react/macro";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/hooks/mutations/useAuthMutations";

export default function UserMenu() {
  const { user } = useAuth();

  const initials = `${user?.profile?.firstName?.[0] ?? ""}${
    user?.profile?.lastName?.[0] ?? ""
  }`.toUpperCase();

  const logoutAction = useLogoutMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {user?.profile?.firstName} {user?.profile?.lastName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={routes.profile}>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Trans>Profile</Trans>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => logoutAction.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <Trans>Log out</Trans>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
