import ContactForm from "./components/ContactForm";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

const services = [
  {
    title: "Pintura Interior",
    desc: "Paredes, sostres i espais interiors amb acabats professionals.",
  },
  {
    title: "Pintura Exterior",
    desc: "Façanes i exteriors amb pintures resistents al clima.",
  },
  {
    title: "Carpinteria",
    desc: "Arreglos i treballs de fusteria en general.",
  },
  {
    title: "Barnissat",
    desc: "Vernissat de fusta i superfícies.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Pintura i Reformes a Menorca
            </h1>
            <p className="text-lg mb-6 text-white/90">
              Arreglos de Carpinteria, Pintado y Barnizado en General. Paredes
              Interiores, Exteriores y Carpinteria.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#contacte"
                className="bg-white text-primary font-medium py-3 px-6 rounded hover:bg-gray-100 transition-colors"
              >
                Sol·licita Pressupost
              </Link>
              <Link
                href="/portfolio"
                className="border border-white text-white font-medium py-3 px-6 rounded hover:bg-white/10 transition-colors"
              >
                Veure Treballs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Serveis</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                href={`/portfolio?filter=${encodeURIComponent(service.title)}`}
                className="border border-gray-200 p-6 rounded-lg hover:border-primary hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
                <span className="text-primary text-sm mt-3 inline-block">
                  Veure treballs →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/serveis"
              className="text-primary hover:underline text-sm"
            >
              Veure tots els serveis →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sobre Nosaltres
            </h2>
            <p className="text-gray-600 mb-4">
              Som una empresa familiar dedicada a la pintura i les reformes a
              Menorca. Oferim serveis de qualitat amb atenció personalitzada per
              a cada projecte.
            </p>
            <div className="flex items-center space-x-4 mt-6 p-4 bg-white rounded border border-gray-200">
              <Image
                src="/logo-color.png"
                alt="Miquel A. Riudavets"
                width={40}
                height={67}
                className="h-12 w-auto"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  Miquel A. Riudavets Mercadal
                </p>
                <p className="text-sm text-gray-500">Es Castell, Menorca</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacte" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Contacte</h2>
            <p className="text-gray-600 mb-6">
              Tens alguna pregunta o vols sol·licitar un pressupost? Envia'ns un
              missatge.
            </p>
            <Suspense
              fallback={
                <div className="p-6 border border-gray-200 rounded-lg">
                  Carregant...
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
