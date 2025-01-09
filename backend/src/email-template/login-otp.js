let html = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ConvoSpace Login OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffff;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #1f2937;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            color: white;
        }
        .header {
            display: flex;
            justify-content:center;
            align-items:center;
            margin-bottom: 20px;
        }
        .header img {
            width: 50px;
            height: 50px;
        }
        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: bold;
            margin-left: 5px;
        }
        .otp-code {
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            color: #3498db;
            margin: 20px 0;
            letter-spacing: 10px;
        }
        .message {
            font-size: 16px;
            color: white;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #7f8c8d;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://res.cloudinary.com/coderpj/image/upload/v1735216127/ConvoSpace/kfd77wypuystck31koxw.png" alt="ConvoSpace Logo">
            <h1>ConvoSpace</h1>
        </div>

        <!-- OTP Message -->
        <p class="message">Hello,</p>
        <p class="message">We received a request to log into your ConvoSpace account. Use the following OTP to complete the process:</p>

        <!-- OTP Code -->
        <div class="otp-code">
            {otp}
        </div>

        <!-- Instructions -->
        <p class="message">This OTP is valid for the next 10 minutes. If you didn't request a login, please ignore this email.</p>

        <!-- Footer -->
        <div class="footer">
            <p>If you have any questions, feel free to <a href="mailto:convospace.team@gmail.com">contact us</a>.</p>
            <p>&copy; 2024 ConvoSpace, All rights reserved.</p>
        </div>
    </div>

</body>
</html>
`;

export default html;