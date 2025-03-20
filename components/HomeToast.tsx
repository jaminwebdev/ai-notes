'use client';

import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type ToastConfig = {
  title: string;
  description: string;
};

const TOAST_CONFIG: Record<string, ToastConfig> = {
  login: {
    title: 'Logged in',
    description: 'You have been successfully logged in',
  },
  signUp: {
    title: 'Signed up',
    description: 'Check your email for a confirmation link',
  },
  newNote: {
    title: 'New Note',
    description: 'You have successfully created a new note',
  },
  logOut: {
    title: 'Logged out',
    description: 'You have been successfully logged out',
  },
};

type ToastType = keyof typeof TOAST_CONFIG;

function isToastType(value: string | null): value is ToastType {
  return value !== null && value in TOAST_CONFIG;
}

function HomeToast() {
  const toastType = useSearchParams().get('toastType');

  const removeUrlParam = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('toastType');
    const newUrl = `${window.location.pathname}${
      searchParams.toString() ? `?${searchParams}` : ''
    }`;
    window.history.replaceState({}, '', newUrl);
  };

  useEffect(() => {
    if (isToastType(toastType)) {
      toast(TOAST_CONFIG[toastType].title, {
        description: TOAST_CONFIG[toastType].description,
      });

      removeUrlParam();
    }
  }, [toastType, toast]);

  return null;
}

export default HomeToast;
