import { getMaterials, getMaterialCategories } from "../actions";
import MaterialsGrid from "../components/MaterialsGrid";
import Link from "next/link";
import type { Material, MaterialCategory } from "@/types";

export const metadata = {
  title: "Materials | Miquel A. Riudavets Mercadal",
  description: "Consulta els nostres materials de pintura i construcció. Preus, disponibilitat i qualitat garantida.",
};

// Sample materials data (will be replaced by DB data when available)
const sampleMaterials: Material[] = [
  {
    id: "1",
    name: "Pintura Plàstica Blanca",
    description: "Pintura plàstica mate per a interiors. Alta qualitat i rendiment. Cobertura de fins a 12m² per litre.",
    category: "Pintures",
    brand: "Titan",
    unit: "litre",
    price: 4.50,
    stock_quantity: 150,
    image_url: "/materials/paint-white.jpg",
    is_available: true,
  },
  {
    id: "2",
    name: "Pintura Exterior Façanes",
    description: "Pintura acrílica per a exteriors. Resistència a la intempèrie i als raigs UV. Acabat mat.",
    category: "Pintures",
    brand: "Valentine",
    unit: "litre",
    price: 8.90,
    stock_quantity: 80,
    image_url: "/materials/paint-exterior.jpg",
    is_available: true,
  },
  {
    id: "3",
    name: "Esmalte Sintètic",
    description: "Esmalte brillant per a fusta i metall. Secat ràpid i alta durabilitat.",
    category: "Pintures",
    brand: "Titanlux",
    unit: "litre",
    price: 12.50,
    stock_quantity: 45,
    image_url: "/materials/enamel.jpg",
    is_available: true,
  },
  {
    id: "4",
    name: "Imprimació Universal",
    description: "Imprimació adherent per a tot tipus de superfícies. Base aquosa.",
    category: "Imprimacions",
    brand: "Titan",
    unit: "litre",
    price: 9.90,
    stock_quantity: 35,
    image_url: "/materials/primer.jpg",
    is_available: true,
  },
  {
    id: "5",
    name: "Massilla Plàstica",
    description: "Massilla per a reparació de parets i sostres. Fàcil aplicació i lleuger.",
    category: "Materials de Construcció",
    brand: "Aguaplast",
    unit: "kg",
    price: 3.20,
    stock_quantity: 200,
    image_url: "/materials/filler.jpg",
    is_available: true,
  },
  {
    id: "6",
    name: "Rodet de Pintura 22cm",
    description: "Rodet professional per a pintura plàstica. Pel curt per a acabats llisos.",
    category: "Eines",
    brand: "Rollex",
    unit: "unitat",
    price: 6.50,
    stock_quantity: 50,
    image_url: "/materials/roller.jpg",
    is_available: true,
  },
  {
    id: "7",
    name: "Brotxa Professional 100mm",
    description: "Brotxa de cerdes naturals per a esmalts i vernissos. Mànec de fusta.",
    category: "Eines",
    brand: "Leganés",
    unit: "unitat",
    price: 8.90,
    stock_quantity: 30,
    image_url: "/materials/brush.jpg",
    is_available: true,
  },
  {
    id: "8",
    name: "Cinta de Pintor 48mm",
    description: "Cinta de carrosser per a protecció. Fàcil retirada sense deixar residus. 50m.",
    category: "Eines",
    brand: "3M",
    unit: "unitat",
    price: 4.90,
    stock_quantity: 100,
    image_url: "/materials/tape.jpg",
    is_available: true,
  },
  {
    id: "9",
    name: "Vernís Marí",
    description: "Vernís per a exteriors. Alta resistència a l'aigua i als raigs UV. Acabat brillant.",
    category: "Acabats",
    brand: "Xylazel",
    unit: "litre",
    price: 18.90,
    stock_quantity: 20,
    image_url: "/materials/varnish.jpg",
    is_available: true,
  },
  {
    id: "10",
    name: "Estuc Venecià",
    description: "Estuc decoratiu per a acabats de luxe. Colors personalitzats disponibles.",
    category: "Acabats",
    brand: "Giorgio Graesan",
    unit: "kg",
    price: 35.00,
    stock_quantity: 15,
    image_url: "/materials/stucco.jpg",
    is_available: true,
  },
  {
    id: "11",
    name: "Impermeabilitzant Terrazas",
    description: "Membrana líquida per a impermeabilització de terrasses i cobertes planes.",
    category: "Imprimacions",
    brand: "Sika",
    unit: "kg",
    price: 14.50,
    stock_quantity: 40,
    image_url: "/materials/waterproof.jpg",
    is_available: true,
  },
  {
    id: "12",
    name: "Guix Ràpid",
    description: "Guix d'enduriment ràpid per a petites reparacions. Temps de treball 15 minuts.",
    category: "Materials de Construcció",
    brand: "Placo",
    unit: "kg",
    price: 2.80,
    stock_quantity: 0,
    image_url: "/materials/plaster.jpg",
    is_available: false,
  },
];

const sampleCategories: MaterialCategory[] = [
  { id: "1", name: "Pintures", description: "Pintures i esmalts per a interiors i exteriors", display_order: 1 },
  { id: "2", name: "Eines", description: "Eines de pintura i reforma", display_order: 2 },
  { id: "3", name: "Materials de Construcció", description: "Materials per a reformes i construcció", display_order: 3 },
  { id: "4", name: "Acabats", description: "Materials d\'acabat i decoració", display_order: 4 },
  { id: "5", name: "Imprimacions", description: "Imprimacions i preparacions", display_order: 5 },
];

export default async function MaterialsPage() {
  // Try to get data from DB, fallback to sample data
  const dbMaterials = await getMaterials();
  const dbCategories = await getMaterialCategories();
  
  const materials = dbMaterials.length > 0 ? dbMaterials : sampleMaterials;
  const categories = dbCategories.length > 0 ? dbCategories : sampleCategories;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Materials i Productes
            </h1>
            <p className="text-xl text-white/90">
              Consulta el nostre catàleg de materials de pintura i construcció. 
              Qualitat garantida i preus competitius.
            </p>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-6 bg-[var(--secondary-light)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-gray-800">Preus sense IVA</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-800">Stock actualitzat en temps real</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium text-gray-800">Consulta'ns per comandes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-16 bg-[var(--warm-white)]">
        <div className="container mx-auto px-4">
          <MaterialsGrid materials={materials} categories={categories} />
        </div>
      </section>

      {/* Services CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Necessites ajuda per triar els materials adequats?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              El nostre equip t'assessorarà sobre els millors productes per al teu projecte. 
              Contacta'ns i t'ajudarem sense compromís.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contacte"
                className="bg-white text-[var(--primary)] font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all inline-block"
              >
                Contactar
              </Link>
              <a
                href="tel:+34600000000"
                className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white/10 transition-all inline-block"
              >
                Trucar Ara
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
