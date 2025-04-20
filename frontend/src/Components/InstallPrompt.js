"use client";

import { useEffect, useState } from "react";

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    );
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
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  if (isStandalone) {
    return null;
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl text-center">
      <h3 className="text-lg font-semibold mb-2">Install App</h3>

      {!isIOS && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="bg-primary px-4 py-2 rounded text-white"
        >
          Add to Home Screen
        </button>
      )}

      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon"> ⎋ </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon"> ➕ </span>.
        </p>
      )}
    </div>
  );
}

export default InstallPrompt;
