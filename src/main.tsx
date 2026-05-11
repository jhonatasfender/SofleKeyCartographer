import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { AppLayout } from "./components/AppLayout";
import Home from "./screens/Home";
import { upsertAppUser } from "./lib/upsertAppUser";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

function AuthSync() {
  const { user, isSignedIn } = useUser();
  const lastSyncedUserIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!isSignedIn || !user) return;
    if (lastSyncedUserIdRef.current === user.id) return;

    lastSyncedUserIdRef.current = user.id;
    const email = user.primaryEmailAddress?.emailAddress ?? null;
    upsertAppUser({ clerkUserId: user.id, email }).catch((err) => {
      console.error("Upsert app user failed", err);
    });
  }, [isSignedIn, user]);

  return null;
}

function App() {
  return (
    <AppLayout
      headerRight={
        <>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </>
      }
    >
      <AuthSync />
      <SignedIn>
        <Home />
      </SignedIn>
      <SignedOut>
        <AuthPanel />
      </SignedOut>
    </AppLayout>
  );
}

function AuthPanel() {
  const [view, setView] = React.useState<"sign-in" | "sign-up">("sign-in");
  return (
    <div className="h-[calc(100dvh-200px)] w-full flex items-center justify-center">
      <div className="p-6 md:p-8 rounded-2xl bg-neutral-800/60 shadow-xl max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          SofleKeyCartographer
        </h1>
        <p className="opacity-80 mb-6 text-center">
          Faça login para visualizar e editar seu layout.
        </p>
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex gap-1 rounded-lg bg-neutral-900/60 p-1 border border-neutral-700/60">
            <button
              className={`px-3 py-1.5 rounded-md text-sm ${view === "sign-in" ? "bg-neutral-700/60" : "opacity-80 hover:opacity-100"}`}
              onClick={() => setView("sign-in")}
            >
              Entrar
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm ${view === "sign-up" ? "bg-neutral-700/60" : "opacity-80 hover:opacity-100"}`}
              onClick={() => setView("sign-up")}
            >
              Criar conta
            </button>
          </div>
        </div>
        <div className="grid place-items-center">
          {view === "sign-in" ? (
            <SignIn routing="virtual" afterSignInUrl="/" />
          ) : (
            <SignUp routing="virtual" afterSignUpUrl="/" />
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
