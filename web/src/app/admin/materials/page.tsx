// Force dynamic rendering so admin materials page isn't prerendered at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAllMaterials } from "../actions";
import MaterialsEditor from "./MaterialsEditor";

export default async function AdminMaterialsPage() {
  const materials = await getAllMaterials();

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestió de Materials
          </h1>
        </div>
        <MaterialsEditor initialMaterials={materials} />
      </div>
    </div>
  );
}
