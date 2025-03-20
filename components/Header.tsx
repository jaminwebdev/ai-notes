import { shadow } from '@/styles/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import DarkModeToggle from './DarkModeToggle';
import LogOutButton from './LogOutButton';
import { getUser } from '@/auth/server';

async function Header() {
  const user = await getUser();

  return (
    <header
      className="relative flex items-center justify-between p-6 small:px-8 w-full bg-popover"
      style={{
        boxShadow: shadow,
      }}
    >
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="AI Notes main logo"
          height={40}
          width={40}
          className="rotate-180"
        />

        <h1 className="text-2xl font-semibold">
          AI <span>Notes</span>
        </h1>
      </Link>
      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
