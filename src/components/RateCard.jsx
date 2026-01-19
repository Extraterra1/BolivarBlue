import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

export default function RateCard({ title, rate, provider, color, icon, trend }) {
  const formatRate = (val) => {
    return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(val);
  };

  return (
    <Card className="min-w-[280px] md:min-w-[300px] border-none rounded-xl bg-gradient-to-br from-gray-900 to-black shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-95">
      <CardHeader className="flex gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
        <div className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-${color}-500/20 text-${color}-500 text-xl md:text-2xl`}>{icon}</div>
        <div className="flex flex-col">
          <p className="text-sm md:text-md font-bold text-gray-300 uppercase tracking-wider">{title}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Source: {provider}</p>
        </div>
      </CardHeader>
      <Divider className="bg-white/10" />
      <CardBody className="px-5 md:px-6 py-6 md:py-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {rate ? formatRate(rate) : '---'}
            </span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-${trend === 'up' ? 'green' : trend === 'down' ? 'red' : 'gray'}-500 mb-1`}>
              {trend === 'up' ? <FaArrowUp /> : trend === 'down' ? <FaArrowDown /> : <FaMinus />}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
