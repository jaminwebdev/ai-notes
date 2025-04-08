'use server';

import { createClient } from '@/supabase/server';
import { handleError } from '@/lib/utils';

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          actual_redirect: `${process.env.NEXT_PUBLIC_BASE_URL}}/login?verify=true`,
        },
      },
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error('Error signing up');

    const { error: userCreationError } = await supabase
      .from('ai_notes_user')
      .insert([{ id: userId, email }]);

    if (userCreationError) throw userCreationError;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
