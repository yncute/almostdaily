"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(protected)/actions";
import { ModeToggle } from "./ModeToggle";

const links = [
  { href: "/", label: "home" },
  { href: "/journal/whiteboard", label: "whiteboard" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background px-6 py-4">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            className="font-bold text-foreground"
            href={"/"}
          >
            almostdaily
          </Link>
          <div className="flex items-center gap-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm ${
                  pathname === href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          <ModeToggle></ModeToggle>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
