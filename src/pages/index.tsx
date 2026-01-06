
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// O 'App' contém lógica de navegador (window, localStorage, canvas) que quebra no servidor (SSR).
// Usamos next/dynamic com ssr: false para carregar o App apenas no cliente.
const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0a0a0c] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-sm text-gray-400 animate-pulse">Iniciando a Forja...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
     return <div className="bg-[#0a0a0c] h-screen w-screen" />;
  }

  return <App />;
}
