import { getMaterials } from "../actions";
import MaterialsGrid from "../components/MaterialsGrid";
import Link from "next/link";
import type { Material } from "@/types";

export const metadata = {
  title: "Materials | Miquel A. Riudavets Mercadal",
  description: "Materials de pintura i construcció disponibles.",
};

// Sample materials data
const sampleMaterials: Material[] = [
  // Pintures
  {
    id: "1",
    name: "Pintura Plàstica Blanca",
    description: "Pintura plàstica mate per a interiors. Alta cobertura.",
    category: "Pintures",
    brand: "Titan",
    unit: "litre",
    price: 4.50,
    stock_quantity: 150,
    image_url: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "2",
    name: "Pintura Exterior Façanes",
    description: "Pintura acrílica per a exteriors. Resistència UV.",
    category: "Pintures",
    brand: "Valentine",
    unit: "litre",
    price: 8.90,
    stock_quantity: 80,
    image_url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "3",
    name: "Esmalte Sintètic Brillant",
    description: "Esmalte per a fusta i metall. Secat ràpid.",
    category: "Pintures",
    brand: "Titanlux",
    unit: "litre",
    price: 12.50,
    stock_quantity: 45,
    image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "4",
    name: "Pintura Antihumitat",
    description: "Pintura especial per a zones amb humitat.",
    category: "Pintures",
    brand: "Titan",
    unit: "litre",
    price: 15.90,
    stock_quantity: 30,
    image_url: "https://images.unsplash.com/photo-1560574188-6a6774965120?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "5",
    name: "Pintura Plàstica Colors",
    description: "Pintura plàstica en diversos colors. Carta RAL.",
    category: "Pintures",
    brand: "Bruguer",
    unit: "litre",
    price: 6.50,
    stock_quantity: 100,
    image_url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  // Imprimacions
  {
    id: "6",
    name: "Imprimació Universal",
    description: "Imprimació adherent per a tot tipus de superfícies.",
    category: "Imprimacions",
    brand: "Titan",
    unit: "litre",
    price: 9.90,
    stock_quantity: 35,
    image_url: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "7",
    name: "Imprimació Galvanitzat",
    description: "Imprimació especial per a superfícies galvanitzades.",
    category: "Imprimacions",
    brand: "Oxiron",
    unit: "litre",
    price: 14.50,
    stock_quantity: 20,
    image_url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  // Vernissos
  {
    id: "8",
    name: "Vernís per a Fusta",
    description: "Vernís transparent per a fusta interior.",
    category: "Vernissos",
    brand: "Xylazel",
    unit: "litre",
    price: 11.90,
    stock_quantity: 40,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "9",
    name: "Vernís Marítim",
    description: "Vernís especial per a exteriors i ambients humits.",
    category: "Vernissos",
    brand: "Titan Yate",
    unit: "litre",
    price: 18.90,
    stock_quantity: 25,
    image_url: "https://images.unsplash.com/photo-1541123603104-512919d6a96c?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  // Materials
  {
    id: "10",
    name: "Massilla Plàstica",
    description: "Massilla per a reparació de parets i sostres.",
    category: "Materials",
    brand: "Aguaplast",
    unit: "kg",
    price: 3.20,
    stock_quantity: 200,
    image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "11",
    name: "Cinta de Pintor",
    description: "Cinta de carrosser 48mm x 50m. Fàcil retirada.",
    category: "Materials",
    brand: "Tesa",
    unit: "unitat",
    price: 4.50,
    stock_quantity: 100,
    image_url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "12",
    name: "Paper de Vidre",
    description: "Paper de vidre gra mig. Pack de 10 fulles.",
    category: "Materials",
    brand: "Norton",
    unit: "pack",
    price: 5.90,
    stock_quantity: 60,
    image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  // Eines
  {
    id: "13",
    name: "Rodet de Pintura 22cm",
    description: "Rodet professional per a pintura plàstica.",
    category: "Eines",
    brand: "Rollex",
    unit: "unitat",
    price: 6.50,
    stock_quantity: 50,
    image_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "14",
    name: "Brotxa Professional 100mm",
    description: "Brotxa de cerdes naturals per a esmalts.",
    category: "Eines",
    brand: "Leganés",
    unit: "unitat",
    price: 8.90,
    stock_quantity: 30,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "15",
    name: "Safata de Pintura",
    description: "Safata de plàstic per a rodet de 22cm.",
    category: "Eines",
    brand: "Generic",
    unit: "unitat",
    price: 2.50,
    stock_quantity: 80,
    image_url: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80",
    is_available: true,
  },
  {
    id: "16",
    name: "Espàtula Professional",
    description: "Espàtula d'acer inoxidable 10cm.",
    category: "Eines",
    brand: "Bellota",
    unit: "unitat",
    price: 7.90,
    stock_quantity: 25,
    image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
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
          <h1 className="text-2xl md:text-3xl font-bold">
            Materials
          </h1>
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
              Els preus poden variar segons disponibilitat. 
              Contacta amb nosaltres per confirmar preus i estoc.
            </p>
            <Link href="/#contacte" className="text-[var(--primary)] hover:underline text-sm">
              Contactar →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
