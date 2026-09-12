const nodemailer = require("nodemailer");

// ========================================
// SEND PASSWORD RESET OTP
// ========================================

const sendOtpEmail = async (email, otp) => {
  // Check credentials before creating transporter
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is missing from .env");
  }

  if (!process.env.EMAIL_PASS) {
    throw new Error("EMAIL_PASS is missing from .env");
  }

  // Create transporter AFTER environment variables are loaded
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify Gmail connection
  await transporter.verify();

  // Send email
  await transporter.sendMail({
    from: `"Civic Lens" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Civic Lens - Password Reset OTP",

    text: `Your Civic Lens password reset OTP is ${otp}. This OTP is valid for 10 minutes. Do not share this OTP with anyone.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2 style="color: #2563eb;">
          Civic Lens
        </h2>

        <p>
          You requested to reset your Civic Lens password.
        </p>

        <p>
          Your One-Time Password (OTP) is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          background: #f3f4f6;
          padding: 15px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="color: #dc2626;">
          Do not share this OTP with anyone.
        </p>

        <hr>

        <p style="color: #666; font-size: 13px;">
          If you did not request a password reset, you can safely ignore
          this email.
        </p>

      </div>
    `,
  });

  console.log(`Password reset OTP sent to ${email}`);
};

module.exports = {
  sendOtpEmail,
};