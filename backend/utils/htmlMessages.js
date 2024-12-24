exports.newMemberHtml = (phone, password) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Diiwan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            color: #d39833;
        }
        .content {
            margin-bottom: 20px;
        }
        .credentials {
            font-family: "Courier New", monospace;
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #d39833;
        }
        a {
            color: #d39833;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to <a href="https://www.diiwan.com" target="_blank">Diiwan.com</a></h1>
        </div>
        <div class="content">
            <p>Your account has been created successfully. Here are your login credentials:</p>
            <div class="credentials">
                <p>Phone: <strong>+${phone}</strong></p>
                <p>Password: <strong>${password}</strong></p>
            </div>
        </div>
        <div class="footer">
            <p>Thank you for choosing <a href="https://www.diiwan.com" target="_blank">Diiwan.com</a>!</p>
        </div>
    </div>
</body>
</html>
  `;
};
