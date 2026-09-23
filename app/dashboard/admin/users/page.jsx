"use client";

const users = [
  {
    id: 1,
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    role: "User",
  },
  {
    id: 2,
    name: "Karim Hasan",
    email: "karim@example.com",
    role: "Librarian",
  },
];

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Manage Users
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage BiblioDrop users.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full min-w-[600px]">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Name
                </th>

                <th className="px-6 py-4 text-left">
                  Email
                </th>

                <th className="px-6 py-4 text-left">
                  Role
                </th>

                <th className="px-6 py-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}