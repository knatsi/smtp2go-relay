import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json({ limit: "5mb" }));

// Setup SMTP2GO transport
const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP2GO_USER,
    pass: process.env.SMTP2GO_PASS
  }
});

app.get("/", (req, res) => res.send("SMTP2GO relay is running!"));

app.post("/send", async (req, res) => {
  const { to, subject, ics } = req.body;
  if (!to || !ics) {
    return res.status(400).json({ error: "Missing 'to' or 'ics' field." });
  }

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || "no-reply@example.com",
      to,
      subject: subject || "Schema .ics",
      text: "Ditt schema finns bifogat som .ics",
      attachments: [
        {
          filename: "schema.ics",
          content: ics,
          contentType: "text/calendar"
        }
      ]
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Mail send error:", err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server listening on port", port));
