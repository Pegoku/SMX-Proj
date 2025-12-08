import Link from "next/link";

export const metadata = {
  title: "Serveis | Miquel A. Riudavets Mercadal",
  description: "Descobreix tots els nostres serveis de pintura i reformes a Menorca. Pintura interior i exterior, reformes integrals, impermeabilització i més.",
};

const services = [
  {
    id: "pintura-interior",
    title: "Pintura Interior",
    shortDesc: "Transformam els teus espais interiors amb acabats professionals.",
    fullDesc: "Oferim serveis complets de pintura interior per a tot tipus d'espais: habitatges, oficines, locals comercials i més. Utilitzam pintures de primera qualitat per garantir acabats duradors i estèticament impecables.",
    features: [
      "Preparació de superfícies (empastats, llisos)",
      "Pintura de parets i sostres",
      "Pintura de portes i fusteries",
      "Acabats especials i decoratius",
      "Colors personalitzats",
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "pintura-exterior",
    title: "Pintura Exterior",
    shortDesc: "Protegim i embellim les façanes de la teva propietat.",
    fullDesc: "La pintura exterior requereix productes i tècniques específiques per resistir les condicions climàtiques de Menorca. Utilitzam pintures impermeabilitzants i resistents als raigs UV per garantir la durabilitat.",
    features: [
      "Pintura de façanes",
      "Tractaments antihumitat",
      "Pintures impermeabilitzants",
      "Reparació de fissures i esquerdes",
      "Neteja i preparació de superfícies",
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "reformes-integrals",
    title: "Reformes Integrals",
    shortDesc: "Renovam completament els teus espais amb un servei claus en mà.",
    fullDesc: "Oferim un servei complet de reforma que inclou disseny, demolició, instal·lacions, acabats i pintura. Gestionam tot el procés per a que tu només t'hagis de preocupar d'escollir el que t'agrada.",
    features: [
      "Reforma de banys i cuines",
      "Canvi de paviments",
      "Redistribució d'espais",
      "Actualització d'instal·lacions",
      "Gestió integral del projecte",
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
  },
  {
    id: "impermeabilitzacio",
    title: "Impermeabilització",
    shortDesc: "Solucionam problemes d'humitat amb tractaments especialitzats.",
    fullDesc: "Les humitats poden causar greus problemes estructurals i de salut. Oferim solucions definitives per a tot tipus d'humitats: capil·lars, filtracions, condensació, etc.",
    features: [
      "Diagnòstic d'humitats",
      "Impermeabilització de terrasses",
      "Tractament de murs enterrats",
      "Membranes impermeabilitzants",
      "Garantia de resultats",
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: "acabats-decoratius",
    title: "Acabats Decoratius",
    shortDesc: "Donam personalitat als teus espais amb tècniques especials.",
    fullDesc: "Més enllà de la pintura tradicional, oferim acabats decoratius únics que transformaran els teus espais en obres d'art. Des d'estucats venecians fins a efectes texturats.",
    features: [
      "Estucat venecià",
      "Velatures i pàtines",
      "Efectes texturats",
      "Imitació de materials",
      "Frescos i murals",
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: "manteniment",
    title: "Manteniment",
    shortDesc: "Serveis periòdics per conservar les teves instal·lacions.",
    fullDesc: "Oferim contractes de manteniment per a comunitats, hotels i empreses. Un manteniment preventiu adequat pot estalviar-te molts problemes i diners a llarg termini.",
    features: [
      "Inspeccions periòdiques",
      "Reparacions puntuals",
      "Repintats programats",
      "Atenció urgent",
      "Pressupostos personalitzats",
    ],
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ServeisPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Els Nostres Serveis
            </h1>
            <p className="text-xl text-white/90">
              Oferim una àmplia gamma de serveis de pintura i reformes per satisfer 
              totes les teves necessitats. Qualitat, professionalitat i atenció personalitzada.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
              >
                {/* Icon/Image */}
                <div className="w-full lg:w-1/3">
                  <div className="bg-gradient-to-br from-[var(--warm-white)] to-[var(--warm-gray)] rounded-2xl p-12 flex items-center justify-center">
                    <div className="text-[var(--primary)]">
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-2/3">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg">{service.fullDesc}</p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-[var(--secondary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/#contacte?servei=${encodeURIComponent(service.title)}`}
                    className="btn-primary inline-block"
                  >
                    Sol·licitar Pressupost
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-[var(--warm-white)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Com Treballam
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Contacte",
                desc: "Contacta'ns i explica'ns el teu projecte. Podem fer-ho per telèfon, email o formulari web.",
              },
              {
                step: "2",
                title: "Visita",
                desc: "Visitem el lloc per avaluar les necessitats i prendre mesures. Sense cap compromís.",
              },
              {
                step: "3",
                title: "Pressupost",
                desc: "T'enviam un pressupost detallat amb tots els treballs, materials i terminis.",
              },
              {
                step: "4",
                title: "Execució",
                desc: "Realitzam el treball amb la màxima qualitat i respectant els terminis acordats.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Llest per començar el teu projecte?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contacta amb nosaltres avui i t'ajudarem a fer realitat les teves idees. 
            Pressupost gratuït i sense compromís.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contacte"
              className="bg-white text-[var(--primary)] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 inline-block"
            >
              Sol·licita Pressupost
            </Link>
            <a
              href="tel:+34600000000"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Truca'ns
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
