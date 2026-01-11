// Force dynamic rendering so admin services page isn't prerendered at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAllServices } from "../actions";
import ServicesEditor from "./ServicesEditor";

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestió de Serveis
          </h1>
        </div>
        <ServicesEditor initialServices={services} />
      </div>
    </div>
  );
}
