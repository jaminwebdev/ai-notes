export type Note = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};
