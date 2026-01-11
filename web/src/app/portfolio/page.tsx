import { getPortfolioItems } from "../actions";
import PortfolioGallery from "../components/PortfolioGallery";
import Link from "next/link";
import { Suspense } from "react";
import type { PortfolioItem } from "@/types";

export const metadata = {
  title: "Treballs | Miquel A. Riudavets Mercadal",
  description: "Treballs de pintura i reformes realitzats a Menorca.",
};

// Fallback portfolio data
const samplePortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "Pintura interior habitatge Ciutadella",
    description: "Pintura completa de parets i sostres en habitatge de 90m².",
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    category: "Pintura Interior",
  },
  {
    id: "2",
    title: "Pintura exterior xalet Maó",
    description: "Pintura de façana amb productes impermeabilitzants.",
    image_url:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    category: "Pintura Exterior",
  },
  {
    id: "3",
    title: "Pintura apartament turístic",
    description: "Pintura interior amb acabats moderns en colors neutres.",
    image_url:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    category: "Pintura Interior",
  },
  {
    id: "4",
    title: "Barnissat portes fusta",
    description: "Vernissat de portes i marcs de fusta en habitatge.",
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    category: "Barnissat",
  },
  {
    id: "5",
    title: "Façana edifici Es Castell",
    description: "Pintura i reparació de façana en edifici de 3 plantes.",
    image_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    category: "Pintura Exterior",
  },
  {
    id: "6",
    title: "Reparació fusteria finestres",
    description: "Arreglo i pintura de finestres de fusta antigues.",
    image_url:
      "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80",
    category: "Carpinteria",
  },
  {
    id: "7",
    title: "Pintura local comercial",
    description: "Pintura interior de local comercial a Maó.",
    image_url:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
    category: "Pintura Interior",
  },
  {
    id: "8",
    title: "Barnissat bigues de fusta",
    description: "Tractament i vernissat de bigues de fusta vistes.",
    image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    category: "Barnissat",
  },
  {
    id: "9",
    title: "Restauració porta antiga",
    description: "Restauració i pintura de porta d'entrada de fusta massissa.",
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    category: "Carpinteria",
  },
  {
    id: "10",
    title: "Pintura exterior casa de camp",
    description: "Pintura completa de façanes i persianes.",
    image_url:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    category: "Pintura Exterior",
  },
  {
    id: "11",
    title: "Pintura habitació infantil",
    description: "Pintura amb colors vius i acabats especials.",
    image_url:
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=800&q=80",
    category: "Pintura Interior",
  },
  {
    id: "12",
    title: "Barnissat mobles cuina",
    description: "Vernissat de portes d'armaris de cuina.",
    image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
    before_image_url:
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&q=80",
    after_image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
    category: "Barnissat",
  },
];

export default async function PortfolioPage() {
  const dbItems = await getPortfolioItems();
  const portfolioItems = dbItems.length > 0 ? dbItems : samplePortfolio;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-[var(--primary)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            Treballs Realitzats
          </h1>
          <p className="text-white/80 mt-2">
            Alguns dels nostres projectes a Menorca
          </p>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={<div className="text-center py-12">Carregant...</div>}
          >
            <PortfolioGallery items={portfolioItems} />
          </Suspense>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Tens un projecte en ment?
          </h2>
          <p className="text-gray-600 mb-6">
            Contacta amb nosaltres per a un pressupost sense compromís.
          </p>
          <Link href="/#contacte" className="btn-primary">
            Sol·licitar Pressupost
          </Link>
        </div>
      </section>
    </div>
  );
}
