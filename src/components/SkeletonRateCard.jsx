import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { useTheme } from '../context/ThemeContext';

export default function SkeletonRateCard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Theme-aware skeleton colors
  const cardClasses = isDark
    ? 'bg-gradient-to-br from-gray-900 to-black'
    : 'bg-gradient-to-br from-white to-slate-50 border border-[#00247D]/10';

  const skeletonClasses = isDark
    ? 'bg-gray-800 animate-pulse'
    : 'bg-slate-200 animate-pulse';

  const dividerClasses = isDark
    ? 'bg-white/10'
    : 'bg-[#00247D]/10';

  return (
    <Card className={`min-w-[280px] md:min-w-[300px] rounded-xl shadow-lg ${cardClasses}`}>
      <CardHeader className="flex gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
        {/* Skeleton Icon */}
        <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl ${skeletonClasses}`} />
        <div className="flex flex-col gap-2">
          {/* Skeleton Title */}
          <div className={`w-32 h-4 rounded ${skeletonClasses}`} />
          {/* Skeleton Provider */}
          <div className={`w-24 h-3 rounded ${skeletonClasses}`} />
        </div>
      </CardHeader>
      <Divider className={dividerClasses} />
      <CardBody className="px-5 md:px-6 py-6 md:py-8">
        <div className="flex items-end justify-between">
          <div>
            {/* Skeleton Rate */}
            <div className={`w-40 h-8 md:h-10 rounded ${skeletonClasses}`} />
          </div>
          {/* Skeleton Trend */}
          <div className={`w-6 h-6 rounded ${skeletonClasses} mb-1`} />
        </div>
      </CardBody>
    </Card>
  );
}
