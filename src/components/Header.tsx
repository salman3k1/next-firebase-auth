"use client";
import React, { MouseEvent, useCallback } from "react";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { User } from "firebase/auth";
import { useUser } from "@/lib/firebase/user-session";

export default function Header({ initialUser }: { initialUser: User | null }) {
  const user = useUser(initialUser);

  const handleSignOut = useCallback((event: MouseEvent) => {
    event.preventDefault();
    signOut();
  }, []);

  const handleSignIn = useCallback((event: MouseEvent) => {
    event.preventDefault();
    signInWithGoogle();
  }, []);

  return (
    <header className="px-6 py-4">
      {user ? (
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-4 ">
          <img
            className="w-12 rounded-full"
            src={user.photoURL || "/next.svg"}
            alt={user.email ?? ""}
          />
          <ul className="flex gap-4">
            <li className="leading-9">{user.displayName}</li>
            <li>
              <a
                href="#"
                className="px-3 py-1.5 bg-red-500 text-white rounded-md inline-block"
                onClick={handleSignOut}
              >
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <a
          href="#"
          className="px-3 py-1.5 bg-red-500 text-white rounded-md"
          onClick={handleSignIn}
        >
          Sign In with Google
        </a>
      )}
    </header>
  );
}
