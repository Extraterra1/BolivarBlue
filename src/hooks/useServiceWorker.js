import { useRegisterSW } from 'virtual:pwa-register/react';
import { useState } from 'react';

export function useServiceWorker() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
      if (r) {
        r.addEventListener('updatefound', () => {
          const installingWorker = r.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowInstallPrompt(true);
              }
            });
          }
        });
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onOfflineReady() {
      setOfflineReady(true);
    },
    onNeedRefresh() {
      setNeedRefresh(true);
    },
  });

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    showInstallPrompt,
    setShowInstallPrompt,
  };
}
