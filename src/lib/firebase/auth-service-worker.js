// Service worker that sends auth state back to server
// The service worker is built with npm run build-service-worker

import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

// this is set during install or with the first fetch if this is lost due to browser restart etc.
let firebaseConfig;

function populateFirebaseConfig() {
  // extract firebase config from query string
  const serializedFirebaseConfig = new URL(location).searchParams.get(
    "firebaseConfig"
  );

  if (!serializedFirebaseConfig) {
    throw new Error(
      "Firebase Config object not found in service worker query string."
    );
  }

  firebaseConfig = JSON.parse(serializedFirebaseConfig);
}

self.addEventListener("install", () => {
  populateFirebaseConfig();
});

self.addEventListener("fetch", (event) => {
  // If the firebaseConfig is not set,
  // which can happen if the browser is left idle for too long or the browser is shutdown
  //Re-populate the config
  if (!firebaseConfig) {
    populateFirebaseConfig();
  }
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  if (!firebaseConfig) {
    // If firebase config is not found fetch in a regular manner i-e without added headers
    return await fetch(request);
  }
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const installations = getInstallations(app);
  const headers = new Headers(request.headers);
  const [authIdToken, installationToken] = await Promise.all([
    getAuthIdToken(auth),
    getToken(installations),
  ]);
  headers.append("Firebase-Instance-ID-Token", installationToken);
  if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
  const newRequest = new Request(request, { headers });
  return await fetch(newRequest);
}

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
}
