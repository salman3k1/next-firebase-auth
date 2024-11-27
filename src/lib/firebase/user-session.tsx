import { firebaseConfig } from "@/lib/firebase/config";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, onAuthStateReady } from "@/lib/firebase/auth";

type FirebaseAuthProviderValue = { user?: User | null };

const FirebaseAuthContext = createContext<FirebaseAuthProviderValue>({
  user: null,
});

type FirebaseAuthProviderProps = {
  children: ReactNode;
};
export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const [user, setUser] = useState<User | undefined | null>(null);
  const router = useRouter();

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user]);

  return (
    <FirebaseAuthContext.Provider value={{ user }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

/**
 * @param {User | undefined | null} initialUser The initialUser can be passed on here if we already have it via a server component to pre-seed user
 *
 * */
export function useUser(initialUser?: User | null) {
  const [isReady, setIsReady] = useState(false);

  const { user } = useContext(FirebaseAuthContext);

  useEffect(() => {
    onAuthStateReady().then(() => {
      setIsReady(true);
    });
  }, []);

  return isReady ? user : initialUser;
}
