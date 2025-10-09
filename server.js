import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

// Configure Gmail SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, icsContent } = req.body;
    if (!to || !subject) {
      return res.status(400).json({ error: "Missing 'to' or 'subject'" });
    }

    const mailOptions = {
      from: `"Schema App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: "Hej! Här är ditt arbetsschema som kalenderfil.",
      attachments: icsContent
        ? [
            {
              filename: "schema.ics",
              content: icsContent,
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Mail error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`📬 Server running on port ${PORT}`));
