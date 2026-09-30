"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_SERVER;

export default function JwtSync() {
  const { data: session, isPending } = authClient.useSession();

  const syncedUserKey = useRef(null);
  const syncPromiseRef = useRef(Promise.resolve());

  // ---------------------------------------------------------
  // Create a global JWT-ready promise
  // Other backend requests can wait for this promise.
  // ---------------------------------------------------------
  if (typeof window !== "undefined") {
    window.__BIBLIODROP_JWT_READY__ = syncPromiseRef.current;
  }

  // ---------------------------------------------------------
  // Intercept backend requests
  // and wait until JWT sync is completed.
  // ---------------------------------------------------------
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (input, init = {}) => {
      try {
        const requestUrl =
          typeof input === "string"
            ? input
            : input?.url || "";

        const isBackendRequest =
          API_URL &&
          requestUrl.startsWith(API_URL);

        if (isBackendRequest) {
          // Wait for JWT sync before calling Render API
          try {
            await syncPromiseRef.current;
          } catch {
            // Sync error is handled below by backend response
          }

          return originalFetch(input, {
            ...init,
            credentials: "include",
          });
        }

        return originalFetch(input, init);
      } catch (error) {
        console.error(
          "FETCH WRAPPER ERROR:",
          error
        );

        return originalFetch(input, init);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // ---------------------------------------------------------
  // Sync Better Auth session -> Render JWT cookie
  // ---------------------------------------------------------
  useEffect(() => {
    if (isPending) {
      return;
    }

    const userId = session?.user?.id;
    const role =
      session?.user?.role || "user";

    // No logged-in user
    if (!userId) {
      syncedUserKey.current = null;

      syncPromiseRef.current =
        Promise.resolve();

      if (typeof window !== "undefined") {
        window.__BIBLIODROP_JWT_READY__ =
          syncPromiseRef.current;
      }

      return;
    }

    const userKey = `${userId}:${role}`;

    // Already synced
    if (
      syncedUserKey.current === userKey
    ) {
      return;
    }

    // -------------------------------------------------------
    // IMPORTANT:
    // Create the promise BEFORE starting sync.
    // This prevents dashboard requests from running early.
    // -------------------------------------------------------
    const syncJwt = async () => {
      try {
        // Step 1:
        // Get short-lived bootstrap JWT from Next.js
        const response = await fetch(
          "/api/auth/jwt",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data =
          await response.json().catch(
            () => ({})
          );

        if (
          !response.ok ||
          !data?.token
        ) {
          throw new Error(
            data?.message ||
              "Failed to create JWT bootstrap token"
          );
        }

        // Step 2:
        // Send bootstrap JWT to Render
        // Render creates its own HttpOnly cookie.
        const backendResponse =
          await fetch(
            `${API_URL}/auth/jwt`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
              credentials: "include",
              cache: "no-store",
            }
          );

        const backendData =
          await backendResponse
            .json()
            .catch(() => ({}));

        if (!backendResponse.ok) {
          throw new Error(
            backendData?.message ||
              "Failed to sync JWT with backend"
          );
        }

        syncedUserKey.current =
          userKey;

        console.log(
          "JWT cookie synced successfully"
        );
      } catch (error) {
        console.error(
          "JWT SYNC ERROR:",
          error
        );

        // Important:
        // Do not keep requests blocked forever.
        throw error;
      }
    };

    syncPromiseRef.current =
      syncJwt();

    if (typeof window !== "undefined") {
      window.__BIBLIODROP_JWT_READY__ =
        syncPromiseRef.current;
    }
  }, [session, isPending]);

  return null;
}