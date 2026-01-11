import { getMaterials } from "../actions";
import MaterialsGrid from "../components/MaterialsGrid";
import Link from "next/link";
import type { Material } from "@/types";

export const metadata = {
  title: "Materials | Miquel A. Riudavets Mercadal",
  description: "Materials de pintura i construcció disponibles.",
};

// Fallback materials data
const sampleMaterials: Material[] = [
  // Pintures
  {
    id: "1",
    name: "Pintura Plàstica Blanca",
    description: "Pintura plàstica mate per a interiors. Alta cobertura.",
    category: "Pintures",
    brand: "Titan",
    unit: "litre",
    price: 4.5,
    stock_quantity: 150,
    image_url:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
];

export default async function MaterialsPage() {
  const dbMaterials = await getMaterials();
  const materials = dbMaterials.length > 0 ? dbMaterials : sampleMaterials;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-[var(--primary)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Materials</h1>
          <p className="text-white/80 mt-2">
            Pintures, eines i materials disponibles
          </p>
        </div>
      </section>

      {/* Materials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <MaterialsGrid materials={materials} />
        </div>
      </section>

      {/* Info */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Informació
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Els preus poden variar segons disponibilitat. Contacta amb
              nosaltres per confirmar preus i estoc.
            </p>
            <Link
              href="/#contacte"
              className="text-[var(--primary)] hover:underline text-sm"
            >
              Contactar →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
