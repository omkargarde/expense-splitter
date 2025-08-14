'use client';

import { authClient } from '@/lib/auth-client';

export function GitHubSignIn() {
  const handleGitHubSignIn = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/', // Redirect after successful sign-in
    });
  };

  return (
    <button
      className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
      onClick={handleGitHubSignIn}
      type="button"
    >
      Sign in with GitHub
    </button>
  );
}
