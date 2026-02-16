'use client';

import { Nav, NavLink } from '@/components/Nav';
import { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { data: session } = useSession();

  return (
    <>
      <Nav>
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/categories">Categories</NavLink>
            <NavLink href="/admin/orders">Orders</NavLink>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>{session?.user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-primary-foreground hover:text-primary-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}