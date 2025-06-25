import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 shadow bg-gray-100">
      <Link href="/dashboard">
        <Button variant="link">Dashboard</Button>
      </Link>
      <Link href="/settings">
        <Button variant="link">Settings</Button>
      </Link>
    </nav>
  );
}
