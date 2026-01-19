import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FaSyncAlt } from 'react-icons/fa';

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRelease, setCanRelease] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  
  const startY = useRef(0);
  const containerRef = useRef(null);
  
  const THRESHOLD = 120;

  const applyResistance = useCallback((dy) => {
    const resistance = 0.4;
    const maxDistance = THRESHOLD * 2;
    const distance = Math.min(Math.abs(dy), maxDistance);
    const progress = distance / maxDistance;
    return Math.pow(progress, resistance) * maxDistance * Math.sign(dy);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (isRefreshing) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    setShowIndicator(false);
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e) => {
    if (isRefreshing) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 0) return;

    const currentY = e.touches[0].clientY;
    const dy = currentY - startY.current;

    if (dy > 0) {
      e.preventDefault();
      const resistancedDistance = applyResistance(dy);
      setPullDistance(resistancedDistance);
      setCanRelease(resistancedDistance > THRESHOLD * 0.7);
      setShowIndicator(true);
    }
  }, [isRefreshing, applyResistance]);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= THRESHOLD * 0.7 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD * 0.7);
      
      setTimeout(async () => {
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          setCanRelease(false);
          setShowIndicator(false);
        }
      }, 500);
    } else {
      setPullDistance(0);
      setCanRelease(false);
      setShowIndicator(false);
    }
  }, [pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const rotation = canRelease ? (pullDistance / THRESHOLD) * 360 : pullDistance * 3;
  const opacity = Math.min(pullDistance / 100, 1);

  return (
    <div ref={containerRef} style={{ touchAction: 'pan-y' }}>
      <AnimatePresence>
        {showIndicator && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity, y: -20 + pullDistance * 0.5 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center pointer-events-none"
            style={{ height: Math.max(0, pullDistance) }}
          >
            <div className="relative">
              <Motion.div
                animate={{ rotate: isRefreshing ? 360 : rotation }}
                transition={{ 
                  rotate: isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 200, damping: 20 }
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md ${
                  canRelease || isRefreshing 
                    ? 'bg-venezuela-yellow text-black' 
                    : 'bg-white/10 text-white'
                }`}
              >
                <FaSyncAlt className="text-xl" />
              </Motion.div>
              {isRefreshing && (
                <Motion.div
                  className="absolute inset-0 rounded-full border-2 border-venezuela-yellow/30"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
      
      <Motion.div
        animate={{ translateY: isRefreshing ? THRESHOLD * 0.7 : pullDistance }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </Motion.div>
    </div>
  );
}
