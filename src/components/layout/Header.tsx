import { CircleUser, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-surface-1/90 backdrop-blur px-4 lg:px-6">
      <Button variant="outline" size="icon" className="shrink-0 md:hidden border-border bg-surface-1">
        <Menu className="h-5 w-5 text-ink" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="w-full flex-1">
        {/* We can add search here later if needed */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "secondary", size: "icon", className: "rounded-full" })}>
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
