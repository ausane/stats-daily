"use client";

import { signOut } from "next-auth/react";
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
import { TUser } from "@/lib/types";

export default function UserProfile({ user }: { user: TUser }) {
  return (
    <div className="flex-center bbn h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full p-0"
            aria-label="User Icon"
          >
            <Image
              priority
              src={user.image}
              alt="user profile picture"
              height={24}
              width={24}
              className="size-full rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg">
          <DropdownMenuItem
            className="rounded-lg max-sm:p-2"
            aria-label="Username"
          >
            <UserRound className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>{user?.name}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-lg max-sm:p-2"
            aria-label="Email"
          >
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>{user?.email}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="rounded-lg max-sm:p-2"
            aria-label="SignOut"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>SignOut</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
