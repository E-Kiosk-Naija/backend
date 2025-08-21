const CONFIRMED = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified</title>
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
  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6fb" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px; width: 600px; max-width: 100%;">
          <tr>
            <td align="center" style="padding: 30px; border-radius: 10px 10px 0 0;">
              <img src="https://res.cloudinary.com/dycbn3d3i/image/upload/v1749504306/logo-no-bg-compressed_hlirsc.png" alt="Afrilab AI" width="250" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 20px 0;">
              <img src="https://res.cloudinary.com/dycbn3d3i/image/upload/v1749646529/check-mail_compressed_jkoxgb.png" width="70" alt="Success Icon" style="margin-bottom: 20px;">
              <h2 style="color: #1e1e2f;">Your email has been verified</h2>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px;">
              <p style="font-size: 16px; color: #5f6c7b;">
                Thank you for verifying your email. Your account is now active and you're ready to explore Afrilab AI!
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <a href="https://afrilab.ai/dashboard" style="background-color: #4318FF; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
            </td>
          </tr>
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

export default CONFIRMED;
