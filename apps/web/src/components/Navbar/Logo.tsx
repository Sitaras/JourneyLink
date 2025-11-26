"use client";
import Link from "next/link";

export default function Logo({
  logo,
  href,
}: {
  logo?: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-2 no-underline">
      {logo && <div className="text-2xl">{logo}</div>}
      <span className="font-bold text-xl sm:inline">CoPassengers</span>
    </Link>
  );
}
