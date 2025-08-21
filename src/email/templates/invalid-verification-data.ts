const INVALID = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Invalid Verification</title>
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
              <img src="https://res.cloudinary.com/dycbn3d3i/image/upload/v1749504306/logo-no-bg-compressed_hlirsc.png" alt="Afrilab AI" width="250" />            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 20px 0;">
              <img src="https://cdn-icons-png.flaticon.com/512/463/463612.png" width="70" alt="Error Icon" style="margin-bottom: 20px;">
              <h2 style="color: #d9534f;">Invalid verification link</h2>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px;">
              <p style="font-size: 16px; color: #5f6c7b;">
                The verification link you used is invalid or has expired. Please request a new confirmation email.
              </p>
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
</html>`;

export default INVALID;
