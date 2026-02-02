import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function RateCard({ title, rate, provider, color, logo, trend }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formatRate = (val) => {
    return 'Bs. ' + val.toFixed(2);
  };

  // Theme-aware color classes
  const cardClasses = isDark
    ? 'bg-gradient-to-br from-gray-800 to-gray-950 border-white/20'
    : 'bg-gradient-to-br from-white to-slate-50 border-[#00247D]/15 shadow-lg';

  const titleClasses = isDark ? 'text-white' : 'text-slate-900';
  const providerClasses = isDark ? 'text-gray-300' : 'text-slate-600';
  const dividerClasses = isDark ? 'bg-white/20' : 'bg-[#00247D]/10';
  const rateClasses = isDark ? 'text-white' : 'text-slate-900';

  // Color-specific accent styles
  const getAccentColor = () => {
    if (color === 'venezuela-blue') {
      return isDark ? 'bg-blue-500/30 border-blue-500/30' : 'bg-[#00247D]/10 border-[#00247D]/20';
    }
    if (color === 'venezuela-yellow') {
      return isDark ? 'bg-yellow-500/30 border-yellow-500/30' : 'bg-[#d4a017]/10 border-[#d4a017]/20';
    }
    return isDark ? 'bg-gray-500/30 border-gray-500/30' : 'bg-slate-200 border-slate-300';
  };

  const getIconColor = () => {
    if (color === 'venezuela-blue') {
      return isDark ? 'text-blue-400' : 'text-[#00247D]';
    }
    if (color === 'venezuela-yellow') {
      return isDark ? 'text-yellow-400' : 'text-[#d4a017]';
    }
    return isDark ? 'text-gray-400' : 'text-slate-600';
  };

  return (
    <Card className={`min-w-[280px] md:min-w-[300px] rounded-xl ${cardClasses} hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-95`}>
      <CardHeader className="flex gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
        <div
          className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl overflow-hidden border ${getAccentColor()}`}
        >
          {logo ? (
            <img src={logo} alt={title} className="w-8 h-8 md:w-9 md:h-9 object-contain" />
          ) : (
            <span className={`text-xl md:text-2xl font-bold ${getIconColor()}`}>{title.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col">
          <p className={`text-sm md:text-md font-bold uppercase tracking-wider ${titleClasses}`}>{title}</p>
          <p className={`text-[10px] md:text-xs ${providerClasses}`}>Source: {provider}</p>
        </div>
      </CardHeader>
      <Divider className={dividerClasses} />
      <CardBody className="px-5 md:px-6 py-6 md:py-8">
        <div className="flex items-end justify-between">
          <div>
            <span className={`text-3xl md:text-4xl font-extrabold ${rateClasses}`}>{rate ? formatRate(rate) : '---'}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 mb-1 ${
              trend === 'up' 
                ? (isDark ? 'text-green-400' : 'text-green-600')
                : trend === 'down' 
                  ? (isDark ? 'text-red-400' : 'text-red-600')
                  : (isDark ? 'text-gray-400' : 'text-gray-500')
            }`}>
              {trend === 'up' ? <FaArrowUp /> : trend === 'down' ? <FaArrowDown /> : <FaMinus />}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
