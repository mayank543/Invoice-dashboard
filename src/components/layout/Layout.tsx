import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col min-w-0">
        <Header />
        <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-12 bg-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
