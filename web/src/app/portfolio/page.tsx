import { getPortfolioItems } from "../actions";
import PortfolioGallery from "../components/PortfolioGallery";
import Link from "next/link";
import type { PortfolioItem } from "@/types";

export const metadata = {
  title: "Treballs | Miquel A. Riudavets Mercadal",
  description: "Treballs de pintura i reformes realitzats a Menorca.",
};

// Sample portfolio data
const samplePortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "Reforma Habitatge Ciutadella",
    description: "Reforma d'habitatge incloent pintura i acabats.",
    image_url: "/portfolio/project1.jpg",
    before_image_url: "/portfolio/project1-before.jpg",
    after_image_url: "/portfolio/project1-after.jpg",
    category: "Reformes",
  },
  {
    id: "2",
    title: "Pintura Exterior Xalet",
    description: "Pintura de façana amb productes impermeabilitzants.",
    image_url: "/portfolio/project2.jpg",
    before_image_url: "/portfolio/project2-before.jpg",
    after_image_url: "/portfolio/project2-after.jpg",
    category: "Pintura Exterior",
  },
  {
    id: "3",
    title: "Pintura Interior Apartament",
    description: "Pintura completa d'apartament amb acabats moderns.",
    image_url: "/portfolio/project3.jpg",
    before_image_url: "/portfolio/project3-before.jpg",
    after_image_url: "/portfolio/project3-after.jpg",
    category: "Pintura Interior",
  },
  {
    id: "4",
    title: "Barnissat Fusteria",
    description: "Vernissat de portes i fusteria en habitatge.",
    image_url: "/portfolio/project4.jpg",
    before_image_url: "/portfolio/project4-before.jpg",
    after_image_url: "/portfolio/project4-after.jpg",
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
          <PortfolioGallery items={portfolioItems} />
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
