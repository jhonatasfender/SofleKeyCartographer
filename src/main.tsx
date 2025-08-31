import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env
  .VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <div className="min-h-dvh w-full">
      <header className="flex gap-3 justify-end p-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <div className="h-[calc(100dvh-80px)] w-full flex items-center justify-center">
        <div className="p-6 rounded-2xl bg-neutral-800/60 shadow-xl">
          <h1 className="text-2xl font-semibold">SofleKeyCartographer</h1>
          <p className="opacity-80">React + Vite + Tailwind v4</p>
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
