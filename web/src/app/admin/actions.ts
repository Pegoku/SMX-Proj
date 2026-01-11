"use server";

import sql from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Material, PortfolioItem, Service } from "@/types";

// =====================================================
// PORTFOLIO CRUD
// =====================================================

export async function createPortfolioItem(data: {
  title: string;
  description: string;
  image_url: string;
  before_image_url?: string;
  after_image_url?: string;
  category?: string;
  display_order?: number;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const result = await sql`
      INSERT INTO portfolio_items (title, description, image_url, before_image_url, after_image_url, category, display_order, visible)
      VALUES (${data.title}, ${data.description}, ${data.image_url}, ${data.before_image_url || null}, ${data.after_image_url || null}, ${data.category || null}, ${data.display_order || 0}, TRUE)
      RETURNING id
    `;
    revalidatePath("/admin/portfolio");
    revalidatePath("/portfolio");
    return { success: true, id: result[0].id };
  } catch (error) {
    console.error("Failed to create portfolio item:", error);
    return { success: false, error: "Error creant el treball" };
  }
}

export async function updatePortfolioItem(
  id: string,
  data: {
    title?: string;
    description?: string;
    image_url?: string;
    before_image_url?: string;
    after_image_url?: string;
    category?: string;
    display_order?: number;
    visible?: boolean;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE portfolio_items SET
        title = COALESCE(${data.title ?? null}, title),
        description = COALESCE(${data.description ?? null}, description),
        image_url = COALESCE(${data.image_url ?? null}, image_url),
        before_image_url = COALESCE(${data.before_image_url ?? null}, before_image_url),
        after_image_url = COALESCE(${data.after_image_url ?? null}, after_image_url),
        category = COALESCE(${data.category ?? null}, category),
        display_order = COALESCE(${data.display_order ?? null}, display_order),
        visible = COALESCE(${data.visible ?? null}, visible),
        updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath("/admin/portfolio");
    revalidatePath("/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Failed to update portfolio item:", error);
    return { success: false, error: "Error actualitzant el treball" };
  }
}

export async function deletePortfolioItem(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`DELETE FROM portfolio_items WHERE id = ${id}`;
    revalidatePath("/admin/portfolio");
    revalidatePath("/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete portfolio item:", error);
    return { success: false, error: "Error eliminant el treball" };
  }
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const items = await sql`
      SELECT id, title, description, image_url, before_image_url, after_image_url, category, display_order, visible
      FROM portfolio_items
      ORDER BY display_order ASC, created_at DESC
    `;
    return items as unknown as PortfolioItem[];
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);
    return [];
  }
}

// =====================================================
// MATERIALS CRUD
// =====================================================

export async function createMaterial(data: {
  name: string;
  description: string;
  category: string;
  brand?: string;
  unit: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  is_available?: boolean;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const result = await sql`
      INSERT INTO materials (name, description, category, brand, unit, price, stock_quantity, image_url, is_available, is_visible)
      VALUES (${data.name}, ${data.description}, ${data.category}, ${data.brand || null}, ${data.unit}, ${data.price}, ${data.stock_quantity}, ${data.image_url || null}, ${data.is_available ?? true}, TRUE)
      RETURNING id
    `;
    revalidatePath("/admin/materials");
    revalidatePath("/materials");
    return { success: true, id: result[0].id };
  } catch (error) {
    console.error("Failed to create material:", error);
    return { success: false, error: "Error creant el material" };
  }
}

export async function updateMaterial(
  id: string,
  data: {
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    unit?: string;
    price?: number;
    stock_quantity?: number;
    image_url?: string;
    is_available?: boolean;
    is_visible?: boolean;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE materials SET
        name = COALESCE(${data.name ?? null}, name),
        description = COALESCE(${data.description ?? null}, description),
        category = COALESCE(${data.category ?? null}, category),
        brand = COALESCE(${data.brand ?? null}, brand),
        unit = COALESCE(${data.unit ?? null}, unit),
        price = COALESCE(${data.price ?? null}, price),
        stock_quantity = COALESCE(${data.stock_quantity ?? null}, stock_quantity),
        image_url = COALESCE(${data.image_url ?? null}, image_url),
        is_available = COALESCE(${data.is_available ?? null}, is_available),
        is_visible = COALESCE(${data.is_visible ?? null}, is_visible),
        updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath("/admin/materials");
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    console.error("Failed to update material:", error);
    return { success: false, error: "Error actualitzant el material" };
  }
}

export async function deleteMaterial(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`DELETE FROM materials WHERE id = ${id}`;
    revalidatePath("/admin/materials");
    revalidatePath("/materials");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete material:", error);
    return { success: false, error: "Error eliminant el material" };
  }
}

export async function getAllMaterials(): Promise<Material[]> {
  try {
    const materials = await sql`
      SELECT id, name, description, category, brand, unit, price, stock_quantity, image_url, is_available, is_visible
      FROM materials
      ORDER BY category, 
      -- display_order ASC,
      name
    `;
    return materials as unknown as Material[];
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    return [];
  }
}

// =====================================================
// SERVICES CRUD
// =====================================================

export async function createService(data: {
  name: string;
  description: string;
  features?: string[];
  base_price?: number;
  display_order?: number;
  slug?: string;
  icon?: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const result = await sql`
      INSERT INTO services (name, description, features, base_price, display_order, slug, icon, is_active)
      VALUES (${data.name}, ${data.description}, ${data.features || []}, ${data.base_price || null}, ${data.display_order || 0}, ${data.slug || null}, ${data.icon || null}, TRUE)
      RETURNING id
    `;
    revalidatePath("/admin/services");
    revalidatePath("/serveis");
    return { success: true, id: result[0].id };
  } catch (error) {
    console.error("Failed to create service:", error);
    return { success: false, error: "Error creant el servei" };
  }
}

export async function updateService(
  id: string,
  data: {
    name?: string;
    description?: string;
    features?: string[];
    base_price?: number;
    display_order?: number;
    slug?: string;
    icon?: string;
    is_active?: boolean;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      UPDATE services SET
        name = COALESCE(${data.name ?? null}, name),
        description = COALESCE(${data.description ?? null}, description),
        features = COALESCE(${data.features ?? null}, features),
        base_price = COALESCE(${data.base_price ?? null}, base_price),
        display_order = COALESCE(${data.display_order ?? null}, display_order),
        slug = COALESCE(${data.slug ?? null}, slug),
        icon = COALESCE(${data.icon ?? null}, icon),
        is_active = COALESCE(${data.is_active ?? null}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
    `;
    revalidatePath("/admin/services");
    revalidatePath("/serveis");
    return { success: true };
  } catch (error) {
    console.error("Failed to update service:", error);
    return { success: false, error: "Error actualitzant el servei" };
  }
}

export async function deleteService(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`DELETE FROM services WHERE id = ${id}`;
    revalidatePath("/admin/services");
    revalidatePath("/serveis");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete service:", error);
    return { success: false, error: "Error eliminant el servei" };
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const services = await sql`
      SELECT id, name, description, features, base_price, display_order, slug, icon, is_active
      FROM services
      ORDER BY display_order ASC, name
    `;
    return services as unknown as Service[];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}
