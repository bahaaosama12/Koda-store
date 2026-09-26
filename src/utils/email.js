import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import hbs from "hbs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

hbs.registerHelper("multiply", function (price, quantity) {
  return price * quantity;
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildEmail = (templateName, data) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    templateName,
  );
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = hbs.compile(templateSource);

  const html = template({
    ...data,
    year: new Date().getFullYear(),
  });

  return html;
};

const sendEmail = async (to, subject, template, templateData) => {
  try {
    const html = buildEmail(template, templateData);

    const mailOptions = {
      from: {
        name: "YourStore",
        address: process.env.EMAIL_USER,
      },
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`email sent to: ${to}`);
    return { success: true };
  } catch (error) {
    console.error("email error:", error.message);
    return { success: false, error: error.message };
  }
};

export { transporter, sendEmail, formatDate };
