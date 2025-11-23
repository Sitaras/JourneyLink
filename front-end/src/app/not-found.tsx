import { redirect } from "next/navigation";
import { routes } from "@/configs/routes";

export default function NotFound() {
  redirect(routes.home);
}
