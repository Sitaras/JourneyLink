import { redirect } from "next/navigation";
import { routes } from "@/data/routes";

export default function NotFound() {
  redirect(routes.home);
}
