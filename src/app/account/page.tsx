'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Package, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8" />
                  <div>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{session?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium">
                      {session?.user?.isAdmin ? 'Administrator' : 'Customer'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8" />
                  <div>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>View your order history</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/account/orders">
                  <Button className="w-full">View All Orders</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Access */}
            {session?.user?.isAdmin && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Admin Access</CardTitle>
                  <CardDescription>
                    You have administrator privileges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin">
                    <Button variant="outline">Go to Admin Dashboard</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Sign Out */}
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
