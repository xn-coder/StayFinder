
'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Suspense } from 'react';

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;
type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;

function LoginFormWrapper() {
  const { toast } = useToast();
  const { setAuthModalState } = useSettings();
  const { loginWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'default' | 'email'>('default');

  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: "" },
  });

  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onPhoneSubmit = (data: PhoneLoginFormValues) => {
    // This is intentionally non-functional as requested
    toast({
      title: "Feature not implemented",
      description: "Phone login is currently disabled.",
    });
  };

  const onEmailSubmit = async (data: EmailLoginFormValues) => {
    setLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      toast({
        title: "Logged In",
        description: "Welcome back!",
      });
      setAuthModalState({ isOpen: false, view: 'login' });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Login Failed",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = (provider: 'Google' | 'Facebook' | 'Apple') => {
    toast({
        title: `Logging in with ${provider}...`,
        description: `You will be redirected to ${provider}. (Demo only)`,
    });
  };

  if (view === 'email') {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setView('default')} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-xl font-semibold">Log in with email</h2>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={emailForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
              Continue
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Welcome to TripsandStay</h2>
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <div className="border border-input rounded-lg overflow-hidden">
                <div className="p-2 border-b">
                    <Select defaultValue="IN">
                        <SelectTrigger className="border-none focus:ring-0 focus:ring-offset-0 h-auto p-0 bg-transparent">
                            <SelectValue placeholder="Country/Region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IN">India (+91)</SelectItem>
                            <SelectItem value="US">United States (+1)</SelectItem>
                            <SelectItem value="GB">United Kingdom (+44)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                          <Input placeholder="Phone number" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-2" {...field} />
                        </FormControl>
                        <FormMessage className="px-2 pb-1" />
                    </FormItem>
                    )}
                />
            </div>
             <p className="text-xs text-muted-foreground">
                We’ll call or text you to confirm your number. Standard message and data rates apply. <a href="/privacy-policy" className="underline font-semibold">Privacy Policy</a>
            </p>
            <Button type="submit" className="w-full h-12 text-base" disabled={true}>
              Continue
            </Button>
          </form>
        </Form>
        <div className="relative my-2">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-sm text-muted-foreground">or</span>
        </div>
        <div className="space-y-3">
            <Button variant="outline" className="w-full h-12 justify-center text-base" onClick={() => handleSocialLogin('Facebook')}>
                <svg className="mr-4 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1 0-1.5.5-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
                Continue with Facebook
            </Button>
            <Button variant="outline" className="w-full h-12 justify-center text-base" onClick={() => handleSocialLogin('Google')}>
                <svg className="mr-4 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C297.1 114.5 273.5 104 248 104 177.1 104 116.1 165.1 116.1 236H116.1v-.2c0-.2 0-.4 0-.6 0-70.9 61-132 132-132s132 61.1 132 132c0 1.2 0 2.4-.1 3.6H248v84.1h152.2c-15.5 61.5-64.8 111.9-128.3 129.5-12.2 3.4-24.9 5.2-37.9 5.2-61.5 0-115.3-33.1-142.2-82.2 27.3-21.4 60.5-35.3 97.5-35.3 4.3 0 8.5.3 12.7.9l69.2-69.2c-39.2-22.1-85-34.8-134.1-34.8-106.1 0-192.8 76.6-214.3 176.6h428.6z"></path></svg>
                Continue with Google
            </Button>
            <Button variant="outline" className="w-full h-12 justify-center text-base" onClick={() => handleSocialLogin('Apple')}>
                 <svg className="mr-4 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17.6 3.4c-1.7-2-4.1-2.1-5.9-2.1s-4.2.1-5.9 2.1C3.3 5.5 2.5 9.1 4.1 11.8c.8 1.4 1.9 2.9 3.2 2.9s2-.9 3.2-1c1.2-.1 2.3.9 3.2 1c1.3 0 2.4-1.5 3.2-2.9C21.5 9.1 20.7 5.5 17.6 3.4zM12.1 2.6c.1-.1 1.7-1.2 3.5-.8c.6.1 1.2.4 1.7.9c-.6.9-1.5 2.2-1.5 3.5c0 1.6 1.1 2.4 1.8 2.4c.1 0 .2 0 .2-.1c-.9 2.2-2.8 3.5-4.8 3.5c-1.5 0-2.8-.9-3.7-2.1c-1.3-1.8-1.5-4.5.3-6.3z"/></svg>
                Continue with Apple
            </Button>
            <Button variant="outline" className="w-full h-12 justify-center text-base" onClick={() => setView('email')}>
                <Mail className="mr-4 h-5 w-5" />
                Continue with email
            </Button>
        </div>
        <p className="text-center text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => setAuthModalState({ isOpen: true, view: 'signup' })}
            className="font-semibold text-primary underline"
          >
            Sign up
          </button>
        </p>
      </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <LoginFormWrapper />
    </Suspense>
  );
}
