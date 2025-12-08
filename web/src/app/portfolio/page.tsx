import { getPortfolioItems } from "../actions";
import PortfolioGallery from "../components/PortfolioGallery";
import Link from "next/link";
import { Suspense } from "react";
import type { PortfolioItem } from "@/types";

export const metadata = {
  title: "Treballs | Miquel A. Riudavets Mercadal",
  description: "Treballs de pintura i reformes realitzats a Menorca.",
};

// Sample portfolio data
const samplePortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "Pintura interior habitatge Ciutadella",
    description: "Pintura completa de parets i sostres en habitatge de 90m².",
    image_url: "/portfolio/project1.jpg",
    before_image_url: "/portfolio/project1-before.jpg",
    after_image_url: "/portfolio/project1-after.jpg",
    category: "Pintura Interior",
  },
  {
    id: "2",
    title: "Pintura exterior xalet Maó",
    description: "Pintura de façana amb productes impermeabilitzants.",
    image_url: "/portfolio/project2.jpg",
    before_image_url: "/portfolio/project2-before.jpg",
    after_image_url: "/portfolio/project2-after.jpg",
    category: "Pintura Exterior",
  },
  {
    id: "3",
    title: "Pintura apartament turístic",
    description: "Pintura interior amb acabats moderns en colors neutres.",
    image_url: "/portfolio/project3.jpg",
    before_image_url: "/portfolio/project3-before.jpg",
    after_image_url: "/portfolio/project3-after.jpg",
    category: "Pintura Interior",
  },
  {
    id: "4",
    title: "Barnissat portes fusta",
    description: "Vernissat de portes i marcs de fusta en habitatge.",
    image_url: "/portfolio/project4.jpg",
    before_image_url: "/portfolio/project4-before.jpg",
    after_image_url: "/portfolio/project4-after.jpg",
    category: "Barnissat",
  },
  {
    id: "5",
    title: "Façana edifici Es Castell",
    description: "Pintura i reparació de façana en edifici de 3 plantes.",
    image_url: "/portfolio/project5.jpg",
    before_image_url: "/portfolio/project5-before.jpg",
    after_image_url: "/portfolio/project5-after.jpg",
    category: "Pintura Exterior",
  },
  {
    id: "6",
    title: "Reparació fusteria finestres",
    description: "Arreglo i pintura de finestres de fusta antigues.",
    image_url: "/portfolio/project6.jpg",
    before_image_url: "/portfolio/project6-before.jpg",
    after_image_url: "/portfolio/project6-after.jpg",
    category: "Carpinteria",
  },
  {
    id: "7",
    title: "Pintura local comercial",
    description: "Pintura interior de local comercial a Maó.",
    image_url: "/portfolio/project7.jpg",
    before_image_url: "/portfolio/project7-before.jpg",
    after_image_url: "/portfolio/project7-after.jpg",
    category: "Pintura Interior",
  },
  {
    id: "8",
    title: "Barnissat bigues de fusta",
    description: "Tractament i vernissat de bigues de fusta vistes.",
    image_url: "/portfolio/project8.jpg",
    before_image_url: "/portfolio/project8-before.jpg",
    after_image_url: "/portfolio/project8-after.jpg",
    category: "Barnissat",
  },
  {
    id: "9",
    title: "Restauració porta antiga",
    description: "Restauració i pintura de porta d'entrada de fusta massissa.",
    image_url: "/portfolio/project9.jpg",
    before_image_url: "/portfolio/project9-before.jpg",
    after_image_url: "/portfolio/project9-after.jpg",
    category: "Carpinteria",
  },
  {
    id: "10",
    title: "Pintura exterior casa de camp",
    description: "Pintura completa de façanes i persianes.",
    image_url: "/portfolio/project10.jpg",
    before_image_url: "/portfolio/project10-before.jpg",
    after_image_url: "/portfolio/project10-after.jpg",
    category: "Pintura Exterior",
  },
  {
    id: "11",
    title: "Pintura habitació infantil",
    description: "Pintura amb colors vius i acabats especials.",
    image_url: "/portfolio/project11.jpg",
    before_image_url: "/portfolio/project11-before.jpg",
    after_image_url: "/portfolio/project11-after.jpg",
    category: "Pintura Interior",
  },
  {
    id: "12",
    title: "Barnissat mobles cuina",
    description: "Vernissat de portes d'armaris de cuina.",
    image_url: "/portfolio/project12.jpg",
    before_image_url: "/portfolio/project12-before.jpg",
    after_image_url: "/portfolio/project12-after.jpg",
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
          <Suspense fallback={<div className="text-center py-12">Carregant...</div>}>
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
