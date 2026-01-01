import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button Skeleton */}
        <Skeleton className="h-10 w-32 mb-4 rounded-md" />

        {/* Profile Card Skeleton */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            <Skeleton className="h-7 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2 flex-col sm:flex-row">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-full sm:w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 text-center">
                  <Skeleton className="w-8 h-8 mx-auto mb-2 rounded" />
                  <Skeleton className="h-7 w-12 mx-auto mb-2" />
                  <Skeleton className="h-3 w-28 mx-auto" />
                </div>
              ))}
            </div>

            {/* Member Since Skeleton */}
            <div className="mt-6 pt-4 border-t flex items-center justify-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-3 w-48" />
            </div>
          </CardContent>
        </Card>

        {/* Data Export Card Skeleton */}
        <Card className="mt-6">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
