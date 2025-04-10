'use client';

import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { logOutAction } from '@/actions/users';

function LogOutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);

    try {
      const { errorMessage } = await logOutAction();

      if (errorMessage) throw new Error(errorMessage);

      router.push('/login');

      toast('Logged out', {
        description: 'You have been successfully logged out',
      });
    } catch (e) {
      toast('Error 🙀', {
        description: e instanceof Error ? e.message : String(e),
        action: {
          label: 'Dismiss ✌',
          onClick: () => {},
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : 'Log Out'}
    </Button>
  );
}

export default LogOutButton;
