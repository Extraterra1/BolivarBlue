import { Card, CardBody, CardHeader, Divider } from '@heroui/react';

export default function SkeletonRateCard() {
  return (
    <Card className="min-w-[280px] md:min-w-[300px] border-none rounded-xl bg-gradient-to-br from-gray-900 to-black shadow-lg">
      <CardHeader className="flex gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
        {/* Skeleton Icon */}
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gray-800 animate-pulse" />
        <div className="flex flex-col gap-2">
          {/* Skeleton Title */}
          <div className="w-32 h-4 rounded bg-gray-800 animate-pulse" />
          {/* Skeleton Provider */}
          <div className="w-24 h-3 rounded bg-gray-800 animate-pulse" />
        </div>
      </CardHeader>
      <Divider className="bg-white/10" />
      <CardBody className="px-5 md:px-6 py-6 md:py-8">
        <div className="flex items-end justify-between">
          <div>
            {/* Skeleton Rate */}
            <div className="w-40 h-8 md:h-10 rounded bg-gray-800 animate-pulse" />
          </div>
          {/* Skeleton Trend */}
          <div className="w-6 h-6 rounded bg-gray-800 animate-pulse mb-1" />
        </div>
      </CardBody>
    </Card>
  );
}
