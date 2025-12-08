'use server'

import sql from "@/lib/db";

export async function submitServiceRequest(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { message: "Missing required fields", success: false };
  }

  try {
    await sql`
      INSERT INTO service_requests (name, email, phone, message)
      VALUES (${name}, ${email}, ${phone}, ${message})
    `;
    
    return { message: "Request submitted successfully!", success: true };
  } catch (error) {
    console.error("Failed to submit request:", error);
    return { message: "Failed to submit request. Please try again.", success: false };
  }
}
