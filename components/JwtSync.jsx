"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER;

export default function JwtSync() {
  const { data: session, isPending } = authClient.useSession();

  const syncedUserId = useRef(null);

  useEffect(() => {
    /*
     * Automatically send cookies with BiblioDrop backend requests.
     * This prevents us from having to add
     * credentials: "include"
     * manually to every fetch() call.
     */
    const originalFetch = window.fetch;

    window.fetch = async (input, init = {}) => {
      try {
        const requestUrl =
          typeof input === "string"
            ? input
            : input?.url || "";

        const isBackendRequest =
          requestUrl.startsWith(API_URL);

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

  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;

    if (!userId) {
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === userId) {
      return;
    }

    const syncJwt = async () => {
      try {
        const response = await fetch("/api/auth/jwt", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));

          console.error(
            "JWT SYNC ERROR:",
            data?.message || "Failed to create JWT"
          );

          return;
        }

        syncedUserId.current = userId;

        console.log("JWT cookie synced successfully");
      } catch (error) {
        console.error("JWT SYNC ERROR:", error);
      }
    };

    syncJwt();
  }, [session, isPending]);

  return null;
}