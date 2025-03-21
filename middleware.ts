import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createSupabaseClient(request, supabaseResponse);

  const isAuthRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/sign-up';

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthRoute && user) {
    return redirectToHome();
  }

  if (!isAuthRoute && !user) {
    return redirectToLogin();
  }

  return supabaseResponse;
}

function redirectToHome() {
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL));
}

function redirectToLogin() {
  return NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_BASE_URL)
  );
}

const createSupabaseClient = (
  request: NextRequest,
  supabaseResponse: NextResponse
) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
};
