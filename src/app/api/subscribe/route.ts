const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_FORM_ID = process.env.KIT_FORM_ID;

export async function POST(request: Request) {
  if (!KIT_API_KEY || !KIT_FORM_ID) {
    return Response.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let email: string;

  try {
    const body = await request.json();
    email = body.email;
  } catch {
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: KIT_API_KEY,
          email,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Kit API error:", res.status, data);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Kit API request failed:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }
}
