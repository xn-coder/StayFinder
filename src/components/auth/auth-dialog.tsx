
'use client';

import { useSettings } from "@/hooks/use-settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { Separator } from "../ui/separator";

export function AuthDialog() {
  const { authModalState, setAuthModalState } = useSettings();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAuthModalState({ isOpen: false, view: 'login' });
    }
  };

  const isLoginView = authModalState.view === 'login';

  return (
    <Dialog open={authModalState.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-center font-bold text-base">
            {isLoginView ? 'Log in or sign up' : 'Finish signing up'}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="p-6">
          {isLoginView ? <LoginForm /> : <SignupForm />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
