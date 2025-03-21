import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="px-4 pt-10 xl:px-8">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
