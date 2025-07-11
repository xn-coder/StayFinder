
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, Mail, Phone, MessageSquare } from "lucide-react";
import { Suspense } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;
type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;

function LoginFormWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: { phone: "" },
  });

  const onEmailSubmit = async (data: EmailLoginFormValues) => {
    setLoading(true);
    try {
      const loggedInUser = await login(data);
      handleLoginSuccess(loggedInUser);
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  const onPhoneSubmit = (data: PhoneLoginFormValues) => {
    setLoading(true);
    // This is a placeholder for actual phone/WhatsApp login logic (e.g., sending OTP)
    setTimeout(() => {
      toast({
        title: "OTP Sent!",
        description: `An OTP has been sent to ${data.phone}. (Demo only)`,
      });
      setLoading(false);
    }, 1500);
  };
  
  const handleSocialLogin = (provider: 'Google' | 'WhatsApp') => {
    toast({
        title: `Logging in with ${provider}...`,
        description: `You will be redirected to ${provider}. (Demo only)`,
    });
  }

  const handleLoginSuccess = (loggedInUser: any) => {
    const redirectUrl = searchParams.get('redirect');
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });

    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push(loggedInUser.role === 'super-admin' ? '/admin' : '/');
    }
  };
  
  const handleLoginError = (error: any) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: (error as Error).message,
      });
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Choose your preferred method to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex gap-2 mb-4">
              <Button variant={loginMethod === 'email' ? 'default' : 'outline'} onClick={() => setLoginMethod('email')} className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Email
              </Button>
              <Button variant={loginMethod === 'phone' ? 'default' : 'outline'} onClick={() => setLoginMethod('phone')} className="w-full">
                <Phone className="mr-2 h-4 w-4" /> Phone
              </Button>
            </div>
            {loginMethod === 'email' ? (
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 animate-spin" /> : <LogIn className="mr-2" />}
                    Log In with Email
                  </Button>
                </form>
              </Form>
            ) : (
               <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 8900" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 animate-spin" /> : <MessageSquare className="mr-2" />}
                    Send One-Time Password
                  </Button>
                </form>
              </Form>
            )}
             <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-muted-foreground">OR</span>
            </div>
             <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('Google')}>
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C297.1 114.5 273.5 104 248 104 177.1 104 116.1 165.1 116.1 236H116.1v-.2c0-.2 0-.4 0-.6 0-70.9 61-132 132-132s132 61.1 132 132c0 1.2 0 2.4-.1 3.6H248v84.1h152.2c-15.5 61.5-64.8 111.9-128.3 129.5-12.2 3.4-24.9 5.2-37.9 5.2-61.5 0-115.3-33.1-142.2-82.2 27.3-21.4 60.5-35.3 97.5-35.3 4.3 0 8.5.3 12.7.9l69.2-69.2c-39.2-22.1-85-34.8-134.1-34.8-106.1 0-192.8 76.6-214.3 176.6h428.6z"></path></svg>
                    Continue with Google
                </Button>
                 <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('WhatsApp')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Continue with WhatsApp
                </Button>
            </div>
        </CardContent>
      </Card>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <LoginFormWrapper />
    </Suspense>
  );
}
