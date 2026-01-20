import { useState, useEffect } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FaDownload, FaTimes, FaApple, FaAndroid } from 'react-icons/fa';
import { Button } from '@heroui/react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    if (!isIOS) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [dismissed, isIOS]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const iOSInstructions = [
    'Tap the Share button',
    'Scroll down and tap "Add to Home Screen"',
    'Tap "Add" to install'
  ];

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <div className="bg-gradient-to-br from-gray-900 to-black border border-venezuela-yellow/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-venezuela-yellow to-venezuela-blue flex items-center justify-center">
                {isIOS ? <FaApple className="text-xl text-black" /> : <FaAndroid className="text-xl text-black" />}
              </div>
              <div>
                <h3 className="font-bold text-white">Install BolivarBlue</h3>
                <p className="text-xs text-gray-400">Get the native app experience</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          {isIOS ? (
            <div className="space-y-2 mb-4">
              {iOSInstructions.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-venezuela-yellow/20 text-venezuela-yellow flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4">
                <p className="text-sm text-gray-300 mb-2">
                  Install BolivarBlue on your device for quick access and offline support.
                </p>
            </div>
          )}

          {!isIOS ? (
            <Button
              onPress={handleInstall}
              className="w-full bg-gradient-to-r from-venezuela-yellow to-venezuela-yellow/80 text-black font-bold"
              startContent={<FaDownload className="text-sm" />}
            >
              Install Now
            </Button>
          ) : (
            <Button
              onPress={handleDismiss}
              className="w-full bg-gradient-to-r from-venezuela-blue to-venezuela-blue/80 text-white font-bold"
            >
              Got It
            </Button>
          )}
        </div>
      </Motion.div>
    </AnimatePresence>
  );
}
