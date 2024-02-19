"use client";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export const UserAuthForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "There was a problem",
        description: "There was a problem logging in with google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center")}>
      {isLoading ? (
        <Button disabled className="w-full" variant={"default"}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button
          variant={"default"}
          className="w-full"
          onClick={loginWithGoogle}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      )}
    </div>
  );
};
