import Link from "next/link";
import { getServices } from "../actions";
import type { Service } from "@/types";

export const metadata = {
  title: "Serveis | Miquel A. Riudavets Mercadal",
  description: "Serveis de pintura i reformes a Menorca. Pintura interior i exterior, carpinteria, barnissat.",
};

// Fallback services if DB is empty
const fallbackServices: Service[] = [
  {
    id: "pintura-interior",
    name: "Pintura Interior",
    description: "Pintura de parets, sostres i espais interiors. Preparació de superfícies, empastats i acabats professionals.",
    features: [
      "Preparació de superfícies",
      "Pintura de parets i sostres",
      "Pintura de portes i fusteries",
      "Acabats especials",
    ],
    slug: "pintura-interior",
    is_active: true,
    display_order: 1,
  },
  {
    id: "pintura-exterior",
    name: "Pintura Exterior",
    description: "Pintura de façanes i exteriors amb productes resistents a les condicions climàtiques de Menorca.",
    features: [
      "Pintura de façanes",
      "Tractaments antihumitat",
      "Reparació de fissures",
      "Neteja de superfícies",
    ],
    slug: "pintura-exterior",
    is_active: true,
    display_order: 2,
  },
  {
    id: "carpinteria",
    name: "Carpinteria",
    description: "Arreglos de fusteria en general. Portes, finestres, mobles i altres elements de fusta.",
    features: [
      "Reparació de portes",
      "Arreglo de finestres",
      "Restauració de mobles",
      "Treballs a mida",
    ],
    slug: "carpinteria",
    is_active: true,
    display_order: 3,
  },
  {
    id: "barnissat",
    name: "Barnissat",
    description: "Vernissat de fusta i superfícies. Protecció i embelliment de elements de fusta.",
    features: [
      "Vernís de portes",
      "Barnissat de mobles",
      "Tractament de bigues",
      "Acabats naturals",
    ],
    slug: "barnissat",
    is_active: true,
    display_order: 4,
  },
];

export default async function ServeisPage() {
  const dbServices = await getServices();
  const services = dbServices.length > 0 ? dbServices : fallbackServices;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-[var(--primary)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            Serveis
          </h1>
          <p className="text-white/80 mt-2">
            Arreglos de Carpinteria, Pintado y Barnizado en General
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.slug || service.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {service.features && service.features.length > 0 && (
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm mb-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 text-gray-600">
                        <span className="text-[var(--secondary)]">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-3">
                  <Link
                    href={`/portfolio?filter=${encodeURIComponent(service.name)}`}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Veure treballs
                  </Link>
                  <Link
                    href={`/?servei=${encodeURIComponent(service.name)}#contacte`}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Sol·licitar pressupost
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Com Treballam
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Contacte", desc: "Explica'ns el teu projecte" },
              { step: "2", title: "Visita", desc: "Avaluam les necessitats" },
              { step: "3", title: "Pressupost", desc: "T'enviam pressupost detallat" },
              { step: "4", title: "Execució", desc: "Realitzam el treball" },
            ].map((item) => (
              <div key={item.step} className="text-center p-4">
                <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Vols un pressupost?
          </h2>
          <p className="text-gray-600 mb-6">
            Contacta amb nosaltres i t'ajudarem amb el teu projecte.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/#contacte"
              className="btn-primary"
            >
              Contactar
            </Link>
            <a
              href="tel:+34656921314"
              className="btn-secondary"
            >
              656 92 13 14
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
