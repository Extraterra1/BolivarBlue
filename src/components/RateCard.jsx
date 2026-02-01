import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

export default function RateCard({ title, rate, provider, color, logo, trend }) {
  const formatRate = (val) => {
    return 'Bs. ' + val.toFixed(2);
  };

  return (
    <Card className="min-w-[280px] md:min-w-[300px] border border-white/20 rounded-xl bg-gradient-to-br from-gray-800 to-gray-950 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-95">
      <CardHeader className="flex gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
        <div
          className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-${color}-500/30 border border-${color}-500/30 overflow-hidden`}
        >
          {logo ? (
            <img src={logo} alt={title} className="w-8 h-8 md:w-9 md:h-9 object-contain" />
          ) : (
            <span className={`text-${color}-400 text-xl md:text-2xl font-bold`}>{title.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm md:text-md font-bold text-white uppercase tracking-wider">{title}</p>
          <p className="text-[10px] md:text-xs text-gray-300">Source: {provider}</p>
        </div>
      </CardHeader>
      <Divider className="bg-white/20" />
      <CardBody className="px-5 md:px-6 py-6 md:py-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl md:text-4xl font-extrabold text-white">{rate ? formatRate(rate) : '---'}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-${trend === 'up' ? 'green-400' : trend === 'down' ? 'red-400' : 'gray-400'} mb-1`}>
              {trend === 'up' ? <FaArrowUp /> : trend === 'down' ? <FaArrowDown /> : <FaMinus />}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
