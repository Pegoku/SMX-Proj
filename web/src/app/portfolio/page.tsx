import { getPortfolioItems } from "../actions";
import PortfolioGallery from "../components/PortfolioGallery";
import Link from "next/link";
import type { PortfolioItem } from "@/types";

export const metadata = {
  title: "Treballs Realitzats | Miquel A. Riudavets Mercadal",
  description: "Descobreix els nostres treballs de pintura i reformes a Menorca. Galeria de projectes completats amb abans i després.",
};

// Sample portfolio data (will be replaced by DB data when available)
const samplePortfolio: PortfolioItem[] = [
  {
    id: "1",
    title: "Reforma Integral Habitatge Ciutadella",
    description: "Reforma completa d'un habitatge de 120m² incloent pintura, canvi de paviments i actualització d'instal·lacions.",
    image_url: "/portfolio/project1.jpg",
    before_image_url: "/portfolio/project1-before.jpg",
    after_image_url: "/portfolio/project1-after.jpg",
    category: "Reformes",
  },
  {
    id: "2",
    title: "Pintura Exterior Xalet Maó",
    description: "Tractament i pintura de façana amb productes impermeabilitzants i colors personalitzats.",
    image_url: "/portfolio/project2.jpg",
    before_image_url: "/portfolio/project2-before.jpg",
    after_image_url: "/portfolio/project2-after.jpg",
    category: "Pintura Exterior",
  },
  {
    id: "3",
    title: "Pintura Interior Apartament Turístic",
    description: "Pintura completa d'apartament turístic amb acabats moderns i resistents.",
    image_url: "/portfolio/project3.jpg",
    before_image_url: "/portfolio/project3-before.jpg",
    after_image_url: "/portfolio/project3-after.jpg",
    category: "Pintura Interior",
  },
  {
    id: "4",
    title: "Rehabilitació Façana Edifici Històric",
    description: "Restauració i pintura de façana d'edifici del centre històric amb tècniques tradicionals.",
    image_url: "/portfolio/project4.jpg",
    before_image_url: "/portfolio/project4-before.jpg",
    after_image_url: "/portfolio/project4-after.jpg",
    category: "Rehabilitació",
  },
  {
    id: "5",
    title: "Reforma Bany Modern",
    description: "Reforma completa de bany amb instal·lació de plat de dutxa, rajoles i pintura.",
    image_url: "/portfolio/project5.jpg",
    before_image_url: "/portfolio/project5-before.jpg",
    after_image_url: "/portfolio/project5-after.jpg",
    category: "Reformes",
  },
  {
    id: "6",
    title: "Pintura Decorativa Restaurant",
    description: "Acabats decoratius amb estucats i velatures per a restaurant al centre de Maó.",
    image_url: "/portfolio/project6.jpg",
    before_image_url: "/portfolio/project6-before.jpg",
    after_image_url: "/portfolio/project6-after.jpg",
    category: "Decoració",
  },
];

export default async function PortfolioPage() {
  // Try to get portfolio items from DB, fallback to sample data
  const dbItems = await getPortfolioItems();
  const portfolioItems = dbItems.length > 0 ? dbItems : samplePortfolio;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Treballs Realitzats
            </h1>
            <p className="text-xl text-white/90">
              Descobreix alguns dels nostres projectes més destacats. 
              Cada treball reflecteix el nostre compromís amb la qualitat i l'atenció al detall.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">500+</div>
              <div className="text-gray-600">Projectes Completats</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">20+</div>
              <div className="text-gray-600">Anys d'Experiència</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">100%</div>
              <div className="text-gray-600">Clients Satisfets</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">50+</div>
              <div className="text-gray-600">Reformes Integrals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16 bg-[var(--warm-white)]">
        <div className="container mx-auto px-4">
          <PortfolioGallery items={portfolioItems} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Què Diuen els Nostres Clients
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria García",
                location: "Ciutadella",
                text: "Excel·lent treball en la pintura de tot el nostre pis. Molt professionals i nets. Totalment recomanables.",
                rating: 5,
              },
              {
                name: "Joan Pons",
                location: "Maó",
                text: "Vam contractar-los per una reforma integral i el resultat ha superat les nostres expectatives. Gràcies!",
                rating: 5,
              },
              {
                name: "Empresa Turística XYZ",
                location: "Menorca",
                text: "Portem anys confiant en Miquel per al manteniment dels nostres apartaments. Sempre puntuals i eficients.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-[var(--warm-white)] p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vols que el teu projecte sigui el pròxim?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contacta amb nosaltres i t'ajudarem a transformar els teus espais.
          </p>
          <Link
            href="/#contacte"
            className="bg-white text-[var(--primary)] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 inline-block"
          >
            Sol·licita Pressupost Gratuït
          </Link>
        </div>
      </section>
    </div>
  );
}
