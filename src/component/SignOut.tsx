'use client';

import { authClient } from '@/lib/auth-client';

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
      className="text-red-600 hover:text-red-800"
      onClick={handleSignOut}
      type="button"
    >
      Sign Out
    </button>
  );
}
