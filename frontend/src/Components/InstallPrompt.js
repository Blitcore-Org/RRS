"use client";

import { useEffect, useState } from "react";

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);

    setIsMobile(isMobileDevice);
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => {
        setDeferredPrompt(null);
      });
    }
  };

  if (isStandalone || !isMobile) {
    return null;
  }

  return (
    <div className="bg-secondary text-white p-4 rounded-xl text-center font-dm-sans mt-4 mx-4">
      <h3 className="text-subtitle font-semibold mb-2">Install App</h3>

      {!isIOS && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="bg-primary text-black font-semibold px-6 py-2 rounded-full text-button"
        >
          Add to Home Screen
        </button>
      )}

      {isIOS && (
        <p className="text-sm leading-relaxed">
          To install this app on your iOS device, tap the{" "}
          <span role="img" aria-label="share icon">🔗</span>{" "}
          share button and select{" "}
          <span className="font-semibold">"Add to Home Screen"</span>{" "}
          <span role="img" aria-label="plus icon">➕</span>.
        </p>
      )}
    </div>
  );
}

export default InstallPrompt;
