import { getUser } from '@/auth/server';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Home({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  return <div>Home Page</div>;
}

export default Home;
