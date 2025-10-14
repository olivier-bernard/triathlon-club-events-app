import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-foreground text-background">
      <div className="text-lg font-bold">Cycling Events</div>
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/events" className="hover:underline">
          Events
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;