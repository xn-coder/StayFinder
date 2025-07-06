import { SignupForm } from '@/components/auth/signup-form';
import Link from 'next/link';

export default function SignupPage({
  searchParams,
}: {
  searchParams?: { role?: 'user' | 'host' };
}) {
  const role = searchParams?.role || 'user';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-headline">
              Join StayFinder
            </h1>
            <p className="text-muted-foreground">
              Create an account to book unique stays or host your own property.
            </p>
        </div>
        <SignupForm initialRole={role} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
