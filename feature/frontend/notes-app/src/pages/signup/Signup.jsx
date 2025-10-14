import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@Shared/schema";
import {
  apiRequest,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateUsername,
} from "@/utils/helper";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");

    // ✅ Optional frontend validation using helper.js
    if (!validateUsername(data.name))
      return setError("Username must be at least 3 characters.");
    if (!validateEmail(data.email))
      return setError("Please enter a valid email.");
    if (!validatePassword(data.password))
      return setError("Password must be at least 6 characters.");
    if (!validateConfirmPassword(data.password, data.confirmPassword))
      return setError("Passwords do not match.");

    try {
      setLoading(true);

      const response = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        console.log("Token saved:", response.token);
      }
      
      // Store user info
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        console.log("User saved:", response.user);
      }

      console.log("Signup success:", response);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Mona Notes</span>
          </div>
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Start organizing your notes today
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <div className="space-y-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      data-testid="input-name"
                      {...form.register("name")}
                    />
                  </FormControl>
                  {form.formState.errors.name && (
                    <FormMessage>{form.formState.errors.name.message}</FormMessage>
                  )}
                </div>
                <div className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      data-testid="input-email"
                      {...form.register("email")}
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <FormMessage>{form.formState.errors.email.message}</FormMessage>
                  )}
                </div>
                <div className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      data-testid="input-password"
                      {...form.register("password")}
                    />
                  </FormControl>
                  {form.formState.errors.password && (
                    <FormMessage>{form.formState.errors.password.message}</FormMessage>
                  )}
                </div>
                <div className="space-y-2">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-enter your password"
                      data-testid="input-confirm-password"
                      {...form.register("confirmPassword")}
                    />
                  </FormControl>
                  {form.formState.errors.confirmPassword && (
                    <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  data-testid="button-signup"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline"
                data-testid="link-login"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <a
            href="#"
            className="underline hover:text-foreground"
            data-testid="link-terms"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline hover:text-foreground"
            data-testid="link-privacy"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
