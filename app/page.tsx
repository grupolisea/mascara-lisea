import { redirect } from "next/navigation";

export default function Home() {
  // Redirige al usuario automáticamente a la pantalla de login
  redirect("/login");
}