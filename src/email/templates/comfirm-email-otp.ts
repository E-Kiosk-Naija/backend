const CONFIRM_EMAIL_TEMPLATE = (name: string, otp: string): string => {
  return `
    <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
  <!--[if mso]>
  <style type="text/css">
  table {border-collapse:collapse;border-spacing:0;width:100%;}
  div, td {padding:0;}
  div {margin:0 !important;}
  </style>
  <noscript>
  <xml>
  <o:OfficeDocumentSettings>
  <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  </noscript>
  <![endif]-->
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height:1.6; color: #333; background-color: #f6f9fc; margin: 0; padding: 0;">   
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Logo with Background -->
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #3498db;">
        <img src="https://files.sinnts.com/logos/project.png" alt="Company Logo" width="80" height="80" style="display: block; margin: 0 auto; border-radius: 8px; background-color: #ffffff; padding: 10px;" />
      </td>
    </tr>

    <!-- Header -->
    <tr>
      <td style="padding: 15px 0; text-align: center; background-color: #3498db;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your One-Time Password (OTP)</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 30px;">
        <p style="font-size: 16px; color: #2c3e50; margin-bottom: 20px;">
          Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 16px; color: #2c3e50; margin-bottom: 20px;">
          Use the OTP code below to complete your verification process. This code is valid for <strong>30 minutes</strong>.
        </p>

        <!-- OTP Box -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
          <tr>
            <td style="background-color: #e8f6fe; border-radius: 6px; padding: 20px; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #3498db;">
                ${otp}
              </span>
            </td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #555;">
          If you did not request this OTP, please ignore this email or contact our support team.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #2c3e50; padding: 20px; text-align: center;">
        <p style="color: #ffffff; font-size: 12px; margin: 0;">This is an automated message. Please do not reply to this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export default CONFIRM_EMAIL_TEMPLATE;
