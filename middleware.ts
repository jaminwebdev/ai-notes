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

  const { searchParams, pathname } = new URL(request.url);

  if (pathname === '/' && !searchParams.get('noteId')) {
    return handleNoteRedirection(user, supabase, request);
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

async function handleNoteRedirection(
  user: any,
  supabase: any,
  request: NextRequest
) {
  if (!user) return NextResponse.next();

  const { data: notes } = await supabase
    .from('ai_notes_notes')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (notes && notes.length > 0) {
    return redirectToNoteId(request, notes[0]?.id);
  }

  const { data } = await supabase
    .from('ai_notes_notes')
    .insert([{ user_id: user.id, text: '' }])
    .select();

  if (data && data.length > 0) {
    return redirectToNoteId(request, data[0]?.id);
  }

  return NextResponse.json(
    { error: 'Failed to create a new note.' },
    { status: 500 }
  );
}

function redirectToNoteId(request: NextRequest, noteId: any) {
  const url = request.nextUrl.clone();
  url.searchParams.set('noteId', noteId);
  return NextResponse.redirect(url);
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
