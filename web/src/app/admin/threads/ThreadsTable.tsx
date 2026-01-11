"use client";

import { useState } from "react";
import Link from "next/link";

interface Thread {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  status: string;
  created_at: string;
}

interface ThreadsTableProps {
  initialThreads: Thread[];
}

type SortField = "name" | "subject" | "status" | "created_at";
type SortDirection = "asc" | "desc";

export default function ThreadsTable({ initialThreads }: ThreadsTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedThreads = [...initialThreads].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      if (sortField === "created_at") {
        comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
      } else {
        comparison = aVal.localeCompare(bVal);
      }
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      <span className="ml-1 inline-block">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    ) : (
      <span className="ml-1 inline-block text-gray-300">↕</span>
    );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort("name")}
            >
              Client
              <SortIcon field="name" />
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort("subject")}
            >
              Assumpte
              <SortIcon field="subject" />
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort("status")}
            >
              Estat
              <SortIcon field="status" />
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => handleSort("created_at")}
            >
              Data
              <SortIcon field="created_at" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedThreads.map((thread) => (
            <tr key={thread.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="font-medium text-gray-900">{thread.name}</div>
                  <div className="text-sm text-gray-500">{thread.email}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 truncate max-w-xs">
                  {thread.subject}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    thread.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : thread.status === "replied"
                        ? "bg-green-100 text-green-800"
                        : thread.status === "closed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {thread.status === "new"
                    ? "Nou"
                    : thread.status === "replied"
                      ? "Respost"
                      : thread.status === "closed"
                        ? "Tancat"
                        : thread.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(thread.created_at).toLocaleDateString("ca-ES")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/admin/threads/${thread.id}`}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Veure / Respondre
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
