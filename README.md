# next-firebase-auth

A Next.js App that demonstrates the use of firebase auth on client and the server. Follows the auth sections of the [Integrate Firebase with a Next.js app codelab.](https://firebase.google.com/codelabs/firebase-nextjs)

## Reference

The core implementation code can be found under the [src/app/lib/firebase folder](https://github.com/salman3k1/next-firebase-auth/tree/main/src/app/lib/firebase).

- [auth-service-worker.js](https://github.com/salman3k1/next-firebase-auth/tree/main/src/app/lib/firebase/auth-service-worker.js) file contains the code for the service worker that is responsible for transporting the auth state to the backend. This service worker needs to be built using the `npm run build-service-worker` command.
- [auth.ts](https://github.com/salman3k1/next-firebase-auth/tree/main/src/app/lib/firebase/auth.ts) file contains basic helper methods to sign in and sign out. This example uses the Google auth provider but that can conveniently be switched with a provider of your own liking.
- [client-app.ts](https://github.com/salman3k1/next-firebase-auth/tree/main/src/app/lib/firebase/client-app.ts) file contains the client side initialization logic for firebase.
- [server-app.ts](https://github.com/salman3k1/next-firebase-auth/tree/main/src/app/lib/firebase/server-app.ts) file provides the method to initialize and return the firebase auth instance on the server. This method will be used to access the auth state in server components and routes.
- [user-session.tsx](https://github.com/salman3k1/next-firebase-auth/tree/main/src/app/lib/firebase/user-session.tsx) file contains two important functions. First is `FirebaseAuthProvider` that will need to be wrapped around the components that need to be authorized. Then within the context of this provider, we'll be able to use the `useUser` hook from the same file to access the authorized user.

## ENV

This example uses some environmental variables to contain the firebase credentials. You can copy the .env.example file and rename it as .env.local. You can then replace the env variable values with your own credentials.
