'use server'

import sql from "@/lib/db";
import { sendContactNotification, sendConfirmationToCustomer } from "@/lib/email";
import type { Material, MaterialCategory, PortfolioItem, Service } from "@/types";

interface ContactFormState {
  message: string;
  success: boolean;
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string | null;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { message: "Si us plau, omple tots els camps obligatoris.", success: false };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { message: "Si us plau, introdueix un correu electrònic vàlid.", success: false };
  }

  try {
    // Create a new contact thread
    const threadResult = await sql`
      INSERT INTO contact_threads (name, email, phone, subject, status)
      VALUES (${name}, ${email}, ${phone || null}, ${subject}, 'open')
      RETURNING id
    `;

    const threadId = threadResult[0].id;

    // Insert the initial message
    await sql`
      INSERT INTO contact_messages_v2 (thread_id, sender_type, sender_email, message, email_sent)
      VALUES (${threadId}, 'customer', ${email}, ${message}, false)
    `;

    // Also insert into service_requests for backwards compatibility
    await sql`
      INSERT INTO service_requests (name, email, phone, message, status)
      VALUES (${name}, ${email}, ${phone || null}, ${message}, 'pending')
    `;

    // Send email notification to business
    const emailResult = await sendContactNotification({
      name,
      email,
      phone: phone || undefined,
      message,
      threadId,
    });

    if (emailResult.success) {
      // Mark the message as sent
      await sql`
        UPDATE contact_messages_v2 
        SET email_sent = true, email_sent_at = NOW()
        WHERE thread_id = ${threadId} AND sender_type = 'customer'
      `;
    }

    // Send confirmation email to customer
    await sendConfirmationToCustomer({ name, email });

    return {
      message: "Gràcies pel teu missatge! Et respondrem el més aviat possible.",
      success: true,
    };
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    return {
      message: "Hi ha hagut un error en enviar el missatge. Si us plau, torna-ho a provar.",
      success: false,
    };
  }
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const items = await sql`
      SELECT 
        id, 
        title, 
        description, 
        image_url, 
        before_image_url, 
        after_image_url,
        display_order
      FROM portfolio_items 
      WHERE visible = true 
      ORDER BY display_order ASC, created_at DESC
    `;
    return items as unknown as PortfolioItem[];
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);
    return [];
  }
}

export async function getMaterials(category?: string): Promise<Material[]> {
  try {
    if (category && category !== 'all') {
      const materials = await sql`
        SELECT 
          id, 
          name, 
          description, 
          category, 
          brand,
          unit,
          price, 
          stock_quantity,
          image_url,
          is_available
        FROM materials 
        WHERE is_visible = true AND category = ${category}
        ORDER BY category, name
      `;
      return materials as unknown as Material[];
    }
    
    const materials = await sql`
      SELECT 
        id, 
        name, 
        description, 
        category, 
        brand,
        unit,
        price, 
        stock_quantity,
        image_url,
        is_available
      FROM materials 
      WHERE is_visible = true
      ORDER BY category, name
    `;
    return materials as unknown as Material[];
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    return [];
  }
}

export async function getMaterialCategories(): Promise<MaterialCategory[]> {
  try {
    const categories = await sql`
      SELECT id, name, description, display_order
      FROM material_categories
      ORDER BY display_order ASC
    `;
    return categories as unknown as MaterialCategory[];
  } catch (error) {
    console.error("Failed to fetch material categories:", error);
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const services = await sql`
      SELECT id, name, description, base_price
      FROM services
      WHERE is_active = true
      ORDER BY name
    `;
    return services as unknown as Service[];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}
