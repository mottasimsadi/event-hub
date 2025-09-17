import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { getCurrentUser } from '@/lib/auth/jwt';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}