import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function PublicHeader({ active }: { active?: "home" | "twin" | "market" }) {
  const { user, isPending } = useCurrentUserState();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line/70 bg-bg/85 px-4 backdrop-blur-md md:px-8">
      <Link to="/" aria-label="Nirmaan home">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
        {active === "home" ? (
          <a href="#how" className="text-ink">
            How it works
          </a>
        ) : (
          <Link to="/" hash="how" className="hover:text-ink">
            How it works
          </Link>
        )}
        <Link to="/twin" className={active === "twin" ? "text-ink" : "hover:text-ink"}>
          Digital twin
        </Link>
        <Link to="/marketplace" className={active === "market" ? "text-ink" : "hover:text-ink"}>
          Marketplace
        </Link>
      </nav>
      {isPending ? (
        <div className="h-11 w-24 animate-pulse rounded-md bg-bg-sunken" />
      ) : user ? (
        <Button asChild>
          <Link to="/app">Open workspace</Link>
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login" search={{}}>
              Sign in
            </Link>
          </Button>
          <SignedOut>
            <Button asChild>
              <Link to="/login" search={{ redirect: "/app/new" }}>
                Start a project
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild>
              <Link to="/app/new" search={{}}>
                Start a project
              </Link>
            </Button>
          </SignedIn>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-line px-4 py-8 text-sm text-muted md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p>Built for the people who pay for the house — and the people who raise it.</p>
      </div>
    </footer>
  );
}
