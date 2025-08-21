const CONFIRM_EMAIL_TEMPLATE = (confirmationLink: string): string => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirm Your Email</title>
  <style>
    /* Fallback for clients that support media queries */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 20px !important;
      }

      .header img {
        width: 200px !important;
      }

      .btn {
        padding: 14px 24px !important;
        font-size: 16px !important;
      }

      h2 {
        font-size: 22px !important;
      }

      p {
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6fb; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6fb" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Email Container -->
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px; width: 600px; max-width: 100%;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px; border-radius: 10px 10px 0 0;">
              <img src="https://res.cloudinary.com/dycbn3d3i/image/upload/v1749504306/logo-no-bg-compressed_hlirsc.png" alt="Afrilab AI" width="250" style="display: block;">
            </td>
          </tr>

          <!-- Icon and Title -->
          <tr>
            <td align="center" style="padding: 30px 20px 0 20px;">
              <img src="https://res.cloudinary.com/dycbn3d3i/image/upload/v1749646050/verify_email-compressed_asq6ku.png" alt="Email Icon" width="70" style="margin-bottom: 20px;">
              <h2 style="color: #1e1e2f; font-size: 24px; margin: 0;">Please confirm your email address</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td align="center" style="padding: 20px 30px;">
              <p style="font-size: 16px; color: #5f6c7b; margin: 0; line-height: 1.6;">
                Thanks for signing up with <strong>Afrilab AI</strong>. We're thrilled to have you!<br><br>
                Click the button below to confirm your email and complete your registration.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding: 20px;">
              <a href="${confirmationLink}" class="btn" style="background-color: #4318FF; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 17px;">
                Confirm your email address
              </a>
            </td>
          </tr>

          <!-- Support Link -->
          <tr>
            <td align="center" style="padding: 10px 30px 30px 30px;">
              <p style="font-size: 14px; color: #8b97a8;">
                Didn’t sign up for Afrilab AI? <a href="https://afrilab.ai/support" style="color: #6AD2FF; text-decoration: none;">Let us know</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="font-size: 12px; color: #a0aabe; padding: 20px;">
              Afrilab AI • Abuja, Nigeria • &copy; ${new Date().getFullYear()} Afrilab AI
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
};

export default CONFIRM_EMAIL_TEMPLATE;
