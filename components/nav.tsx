"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(protected)/actions";

const links = [
  { href: "/dashboard", label: "dashboard" },
  { href: "/journal", label: "journal" },
  { href: "/journal/whiteboard", label: "whiteboard" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            className="font-bold text-gray-900"
            key={"/dashboard"}
            href={"/dashboard"}
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
                    ? "font-medium text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
