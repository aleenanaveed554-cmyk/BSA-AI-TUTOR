import Link from "next/link";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">B</span>
          BSA Tutor
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/#how">How it works</Link>
          <Link href="/#topics">Topics</Link>
          <Link href="/tutor" className="btn btn-primary btn-sm">Start learning</Link>
        </nav>
      </div>
    </header>
  );
}
