import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner = ({ isOnline }: OfflineBannerProps) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top" role="status" aria-live="polite" aria-atomic="true">
      <Alert className="rounded-none border-x-0 border-t-0 bg-orange-100 border-orange-300">
        <WifiOff className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-900 font-medium">
          You're offline. Your progress won't be saved until you reconnect to the internet.
        </AlertDescription>
      </Alert>
    </div>
  );
};
