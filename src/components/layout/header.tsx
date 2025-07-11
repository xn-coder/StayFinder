
"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useProperties } from '@/hooks/use-properties';
import { Button } from '@/components/ui/button';
import { 
  Menu, Home, LogOut, Crown, LifeBuoy, PlusCircle, Settings, Globe, LayoutDashboard, MessageSquare, Heart, CalendarCheck, BookOpenCheck, UserPlus, PartyPopper, Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { LanguageCurrencyDialog } from '../language-currency-dialog';
import { SearchBar } from '../search-bar';
import { useSettings } from '@/hooks/use-settings';

export function Header({ className }: { className?: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { bookings, inquiries } = useProperties();
  const { setAuthModalState } = useSettings();
  const [isLangCurrencyOpen, setIsLangCurrencyOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  const pendingBookingsCount = useMemo(() => {
    if (!user || user.role !== 'host') return 0;
    return bookings.filter(b => b.property.host.id === user.id && b.status === 'pending').length;
  }, [user, bookings]);

  const pendingInquiriesCount = useMemo(() => {
    if (!user || user.role !== 'host') return 0;
    return inquiries.filter(i => i.property.host.id === user.id && i.status === 'pending').length;
  }, [user, inquiries]);

  return (
    <>
      <header className={cn("sticky top-0 z-50 w-full border-b bg-background", className)}>
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="hidden md:flex items-center gap-2 mr-6 flex-shrink-0">
            <Home className="h-8 w-8 text-primary" />
            <span className="font-bold font-headline text-2xl text-primary">StayFinder</span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center">
             {/* Desktop SearchBar could go here if needed in a different layout */}
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            {user ? (
              <>
                {(user.role === 'host' || user.role === 'user') && (
                  <Link href="/list-property">
                    <Button variant="ghost" className="text-base font-semibold">
                      {user.role === 'host' ? 'List your Property' : 'Become a Host'}
                    </Button>
                  </Link>
                )}
                 <Button variant="ghost" size="icon" onClick={() => setIsLangCurrencyOpen(true)}>
                    <Globe className="h-5 w-5" />
                 </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="relative h-10 rounded-full px-2 gap-2">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push('/account/settings')} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Account setting</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsLangCurrencyOpen(true)} className="cursor-pointer">
                        <Globe className="mr-2 h-4 w-4" />
                        <span>Language and currency</span>
                      </DropdownMenuItem>
                      
                      {user.role === 'host' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push('/my-properties')} className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Host Dashboard</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push('/bookings')} className="cursor-pointer">
                            <BookOpenCheck className="mr-2 h-4 w-4" />
                            <span>Bookings</span>
                             {pendingBookingsCount > 0 && (
                              <Badge variant="destructive" className="ml-auto">{pendingBookingsCount}</Badge>
                             )}
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => router.push('/inquiries')} className="cursor-pointer">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Inquiries</span>
                             {pendingInquiriesCount > 0 && (
                              <Badge variant="destructive" className="ml-auto">{pendingInquiriesCount}</Badge>
                             )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push('/list-property')} className="cursor-pointer">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>Create new listing</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {(user.role === 'user' || user.role === 'host') && (
                        <>
                          <DropdownMenuItem onClick={() => router.push('/my-bookings')} className="cursor-pointer">
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            <span>My Bookings</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push('/wishlist')} className="cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Wishlist</span>
                          </DropdownMenuItem>
                        </>
                      )}

                      {user.role === 'user' && (
                         <DropdownMenuItem onClick={() => router.push('/list-property')} className="cursor-pointer">
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Become a Host</span>
                          </DropdownMenuItem>
                      )}

                      {user.role === 'super-admin' && (
                        <DropdownMenuItem onClick={() => router.push('/admin')} className="cursor-pointer">
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem onClick={() => router.push('/help')} className="cursor-pointer">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Get help</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                 <Button variant="ghost" className="text-base font-semibold" onClick={() => router.push('/list-property')}>
                    Become a Host
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => setIsLangCurrencyOpen(true)}>
                    <Globe className="h-5 w-5" />
                 </Button>
                <Button variant="ghost" className="px-5" onClick={() => setAuthModalState({ isOpen: true, view: 'login' })}>
                  Log in
                </Button>
                <Button variant="outline" className="px-5" onClick={() => setAuthModalState({ isOpen: true, view: 'signup' })}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 pb-4">
            <SearchBar />
        </div>
      </header>
      <LanguageCurrencyDialog isOpen={isLangCurrencyOpen} onOpenChange={setIsLangCurrencyOpen} />
    </>
  );
}
