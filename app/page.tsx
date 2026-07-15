import { redirect } from "next/navigation";

export default function Home() {
  // Redirigimos automáticamente al usuario al hub enmascarado
  redirect("/hub");
}