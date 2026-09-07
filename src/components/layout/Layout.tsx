import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr] bg-canvas text-ink">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col min-w-0">
        <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8 bg-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
