"use server";

import sql from "@/lib/db";
import {
  sendContactNotification,
  sendConfirmationToCustomer,
} from "@/lib/email";
import type {
  Material,
  MaterialCategory,
  PortfolioItem,
  Service,
} from "@/types";

interface ContactFormState {
  message: string;
  success: boolean;
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string | null;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return {
      message: "Si us plau, omple tots els camps obligatoris.",
      success: false,
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      message: "Si us plau, introdueix un correu electrònic vàlid.",
      success: false,
    };
  }

  try {
    // Create a new contact thread
    const threadResult = await sql`
      INSERT INTO contact_threads (name, email, phone, subject, status)
      VALUES (${name}, ${email}, ${phone || null}, ${subject}, 'new')
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
      INSERT INTO service_requests (name, email, phone, service_type, message, status)
      VALUES (${name}, ${email}, ${phone || null}, ${subject}, ${message}, 'pending')
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
      message:
        "Hi ha hagut un error en enviar el missatge. Si us plau, torna-ho a provar.",
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
        display_order,
        category
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
    if (category && category !== "all") {
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
      SELECT id, name, description, features, base_price, display_order, slug, icon, is_active
      FROM services
      WHERE is_active = true
      ORDER BY display_order ASC, name
    `;
    return services as unknown as Service[];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function replyToThread(
  threadId: string,
  message: string,
  businessEmail: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get thread info
    const threads = await sql`
      SELECT id, name, email, subject, status
      FROM contact_threads
      WHERE id = ${threadId}
    `;

    if (threads.length === 0) {
      return { success: false, error: "Thread not found" };
    }

    const thread = threads[0];

    // Add message to thread
    await sql`
      INSERT INTO contact_messages_v2 (thread_id, sender_type, sender_email, message, email_sent)
      VALUES (${threadId}, 'business', ${businessEmail}, ${message}, false)
    `;

    // Update thread status
    await sql`
      UPDATE contact_threads 
      SET status = 'replied', updated_at = NOW()
      WHERE id = ${threadId}
    `;

    // Send email through bot
    const { sendReplyToCustomer } = await import("@/lib/email");
    const emailResult = await sendReplyToCustomer({
      customerEmail: thread.email,
      customerName: thread.name,
      replyMessage: message,
      originalSubject: thread.subject,
      threadId: threadId,
    });

    if (emailResult.success) {
      // Mark message as sent
      await sql`
        UPDATE contact_messages_v2 
        SET email_sent = true, email_sent_at = NOW()
        WHERE thread_id = ${threadId} AND sender_type = 'business' AND email_sent = false
      `;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to reply to thread:", error);
    return { success: false, error: "Failed to send reply" };
  }
}

export async function getThreads(status?: string): Promise<any[]> {
  try {
    if (status && status !== "all") {
      const threads = await sql`
        SELECT t.*, 
          (SELECT COUNT(*) FROM contact_messages_v2 WHERE thread_id = t.id) as message_count,
          (SELECT message FROM contact_messages_v2 WHERE thread_id = t.id ORDER BY created_at ASC LIMIT 1) as first_message
        FROM contact_threads t
        WHERE t.status = ${status}
        ORDER BY t.updated_at DESC
      `;
      return threads;
    }

    const threads = await sql`
      SELECT t.*, 
        (SELECT COUNT(*) FROM contact_messages_v2 WHERE thread_id = t.id) as message_count,
        (SELECT message FROM contact_messages_v2 WHERE thread_id = t.id ORDER BY created_at ASC LIMIT 1) as first_message
      FROM contact_threads t
      ORDER BY t.updated_at DESC
    `;
    return threads;
  } catch (error) {
    console.error("Failed to fetch threads:", error);
    return [];
  }
}

export async function getThreadMessages(threadId: string): Promise<any[]> {
  try {
    const messages = await sql`
      SELECT id, thread_id, sender_type, sender_email, message, email_sent, email_sent_at, created_at
      FROM contact_messages_v2
      WHERE thread_id = ${threadId}
      ORDER BY created_at ASC
    `;
    return messages;
  } catch (error) {
    console.error("Failed to fetch thread messages:", error);
    return [];
  }
}
