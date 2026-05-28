import type { Metadata } from 'next';
import './globals.css';
import { TopBar } from '@/components/layout/TopBar';
import { NavBar } from '@/components/layout/NavBar';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'FIN — Hoosiers LLC',
  description: 'Fantasy Insider Network — Hoosiers LLC coverage powered by AI and Sleeper',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        <NavBar />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: 'calc(100vh - 88px)' }}>
          <main style={{ padding: '16px 20px', overflowY: 'auto', minWidth: 0 }}>{children}</main>
          <Sidebar />
        </div>
      </body>
    </html>
  );
}
