"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_SERVER;

export default function JwtSync() {
  const { data: session, isPending } = authClient.useSession();
  const syncedUserKey = useRef(null);

  // Automatically send cookies with every Render backend request.
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (input, init = {}) => {
      try {
        const requestUrl =
          typeof input === "string" ? input : input?.url || "";

        const isBackendRequest =
          API_URL && requestUrl.startsWith(API_URL);

        if (isBackendRequest) {
          return originalFetch(input, {
            ...init,
            credentials: "include",
          });
        }

        return originalFetch(input, init);
      } catch (error) {
        console.error("FETCH WRAPPER ERROR:", error);
        return originalFetch(input, init);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Create bootstrap JWT and exchange it with the Render backend
  // for the actual HttpOnly JWT cookie.
  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;
    const role = session?.user?.role || "user";

    if (!userId) {
      syncedUserKey.current = null;
      return;
    }

    const userKey = `${userId}:${role}`;

    if (syncedUserKey.current === userKey) {
      return;
    }

    const syncJwt = async () => {
      try {
        // Step 1: Get short-lived bootstrap token from Next.js
        const response = await fetch("/api/auth/jwt", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data?.token) {
          console.error(
            "JWT BOOTSTRAP ERROR:",
            data?.message || "Failed to create bootstrap token"
          );
          return;
        }

        // Step 2: Send bootstrap token to Render.
        // Render will verify it and create the HttpOnly cookie
        // on the Render domain.
        const backendResponse = await fetch(`${API_URL}/auth/jwt`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          credentials: "include",
          cache: "no-store",
        });

        const backendData = await backendResponse
          .json()
          .catch(() => ({}));

        if (!backendResponse.ok) {
          console.error(
            "JWT BACKEND SYNC ERROR:",
            backendData?.message || "Failed to sync JWT with backend"
          );
          return;
        }

        syncedUserKey.current = userKey;

        console.log("JWT cookie synced successfully");
      } catch (error) {
        console.error("JWT SYNC ERROR:", error);
      }
    };

    syncJwt();
  }, [session, isPending]);

  return null;
}