import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, icsContent } = req.body;
    if (!to || !icsContent) {
      return res.status(400).json({ error: "Missing 'to' or 'icsContent'" });
    }

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: subject || "Arbetsschema .ics",
      html: `<p>Hej,</p><p>Här är ditt arbetsschema som kalenderfil.</p>`,
      attachments: [{ filename: "schema.ics", content: icsContent }],
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ error: "Mail send failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
