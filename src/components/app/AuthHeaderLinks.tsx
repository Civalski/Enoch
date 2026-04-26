"use client";

import { LogoutButton } from "@/components/app/LogoutButton";

type Props = {
  isLoggedIn: boolean;
};

export function AuthHeaderLinks({ isLoggedIn }: Props) {
  if (!isLoggedIn) {
    return null;
  }
  return <LogoutButton className="!border-gray-200 !text-gray-700 !py-1 !px-2.5 text-xs md:text-sm" />;
}
