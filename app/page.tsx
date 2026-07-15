import { redirect } from "next/navigation";

export default function Home() {
  // Redirige automáticamente al usuario a la pantalla de login al entrar a la web
  redirect("/login");
}