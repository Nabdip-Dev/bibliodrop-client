"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const role = session.user.role;

      if (role === "librarian") {
        router.replace("/dashboard/librarian");
        return;
      }

      if (role === "admin") {
        router.replace("/dashboard/admin");
        return;
      }

      router.replace("/dashboard/user");
    };

    checkRole();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading dashboard...</p>
    </main>
  );
}