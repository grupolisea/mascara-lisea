"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = localStorage.getItem("ml_session");

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-widest">
          MÁSCARA LISEA
        </h1>

        <p className="mt-4 text-yellow-500">
          Inicializando...
        </p>
      </div>
    </main>
  );
}