"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Mail, UserRound } from "lucide-react";

export default async function UserProfile() {
  const { data: session } = useSession();

  return (
    <div className="flex-center bbn h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0">
            <Image
              src={session?.user?.image as string}
              alt="user profile picture"
              height={24}
              width={24}
              className="size-full rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg">
          <DropdownMenuItem className="rounded-lg max-sm:p-2">
            <UserRound className="mr-2 h-4 w-4" />
            <span>{session?.user?.name}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg max-sm:p-2">
            <Mail className="mr-2 h-4 w-4" />
            <span>{session?.user?.email}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="rounded-lg max-sm:p-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>SignOut</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
