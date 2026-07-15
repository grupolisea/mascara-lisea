'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const ua = navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    setIsMobile(mobile);

    let deviceToken = localStorage.getItem('olisea_device_token');
    if (!deviceToken) {
      deviceToken = uuidv4();
      localStorage.setItem('olisea_device_token', deviceToken);
    }

    const session = localStorage.getItem('olisea_session');
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (session) {
        window.location.href = 'https://qr-access-hub-1.emergent.host/';
      } else {
        router.push('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  if (isMobile === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-yellow-500 p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-gray-400">Acceso exclusivo para dispositivos móviles Android e iOS.</p>
      </div>
    );
  }

  if (showSplash || isMobile === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="w-32 h-32 border-4 border-yellow-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <span className="text-yellow-500 font-bold text-xl">GO</span>
        </div>
        <p className="text-yellow-600 text-sm tracking-widest animate-pulse">CARGANDO SISTEMA...</p>
      </div>
    );
  }

  return null;
}