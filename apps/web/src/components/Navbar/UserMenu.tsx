"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { routes } from "@/configs/routes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/api-actions/auth"; // Import the server action
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();

  const queryClient = useQueryClient();

  const initials = `${user?.profile?.firstName?.[0] ?? ""}${
    user?.profile?.lastName?.[0] ?? ""
  }`.toUpperCase();

  const onLogoutFinally = () => {
    router.refresh();
    toast.success(t`Logged-out successfully!`);
    queryClient.clear();
  };

  const logoutAction = useMutation({
    mutationFn: logout,
    onSuccess: onLogoutFinally,
    onError: onLogoutFinally,
  });

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
