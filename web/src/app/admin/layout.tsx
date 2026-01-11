import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold text-gray-800">
                Panel d&apos;Administració
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin/threads"
                  className="text-gray-600 hover:text-orange-600 text-sm font-medium"
                >
                  Consultes
                </Link>
                <Link
                  href="/admin/portfolio"
                  className="text-gray-600 hover:text-orange-600 text-sm font-medium"
                >
                  Treballs
                </Link>
                <Link
                  href="/admin/materials"
                  className="text-gray-600 hover:text-orange-600 text-sm font-medium"
                >
                  Materials
                </Link>
                <Link
                  href="/admin/services"
                  className="text-gray-600 hover:text-orange-600 text-sm font-medium"
                >
                  Serveis
                </Link>
                <Link
                  href="/admin/invoices"
                  className="text-gray-600 hover:text-orange-600 text-sm font-medium"
                >
                  Factures
                </Link>
              </nav>
            </div>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Tornar al web
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b px-4 py-2 flex gap-4 overflow-x-auto">
        <Link
          href="/admin/threads"
          className="text-gray-600 hover:text-orange-600 text-sm whitespace-nowrap"
        >
          Consultes
        </Link>
        <Link
          href="/admin/portfolio"
          className="text-gray-600 hover:text-orange-600 text-sm whitespace-nowrap"
        >
          Treballs
        </Link>
        <Link
          href="/admin/materials"
          className="text-gray-600 hover:text-orange-600 text-sm whitespace-nowrap"
        >
          Materials
        </Link>
        <Link
          href="/admin/services"
          className="text-gray-600 hover:text-orange-600 text-sm whitespace-nowrap"
        >
          Serveis
        </Link>
        <Link
          href="/admin/invoices"
          className="text-gray-600 hover:text-orange-600 text-sm whitespace-nowrap"
        >
          Factures
        </Link>
      </nav>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
