'use client';

import { authClient } from '@/lib/auth/auth-client';

export function SignOut() {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    });
  };

  return (
    <button
      
      onClick={handleSignOut}
      type="button"
    >
      Sign Out
    </button>
  );
}
