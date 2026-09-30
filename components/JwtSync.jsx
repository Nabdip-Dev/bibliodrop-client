"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_SERVER;

let jwtSyncPromise = null;
let syncedUserKey = null;

export async function syncBackendJwt() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_SERVER is not configured");
  }

  const { data: session } =
    await authClient.getSession();

  if (!session?.user?.id) {
    return false;
  }

  const userId = session.user.id;
  const role = session.user.role || "user";
  const userKey = `${userId}:${role}`;

  // Already synced in this browser session
  if (syncedUserKey === userKey) {
    return true;
  }

  // Another request is already syncing
  if (jwtSyncPromise) {
    await jwtSyncPromise;

    return syncedUserKey === userKey;
  }

  jwtSyncPromise = (async () => {
    try {
      // Get short-lived bootstrap token
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

      // Create HttpOnly JWT cookie on Render
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

      syncedUserKey = userKey;

      console.log(
        "JWT cookie synced successfully"
      );

      return true;
    } finally {
      jwtSyncPromise = null;
    }
  })();

  return await jwtSyncPromise;
}

export default function JwtSync() {
  const { data: session, isPending } =
    authClient.useSession();

  const lastSessionKey = useRef(null);

  useEffect(() => {
    if (isPending || !session?.user?.id) {
      return;
    }

    const userKey = `${
      session.user.id
    }:${
      session.user.role || "user"
    }`;

    if (lastSessionKey.current === userKey) {
      return;
    }

    lastSessionKey.current = userKey;

    syncBackendJwt().catch((error) => {
      console.error(
        "JWT SYNC ERROR:",
        error
      );
    });
  }, [session, isPending]);

  return null;
}