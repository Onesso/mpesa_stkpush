const axios = require("axios");
const moment = require("moment");

// Create token function
const createToken = async (req, res, next) => {
  const consumer_key = "wz7RGguhGYVQ7oeefJVKk93wamBxCDGpuk5ThniDz9KRYEWy";
  const consumer_secret =
    "gnbXwby36oKOdLjVJWKeWTM91nLlps8acnnvwHDzsGqM0xndR80QmWcdIvb0dChW";
  const auth = new Buffer.from(`${consumer_key}:${consumer_secret}`).toString(
    "base64"
  );

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    global.token = response.data.access_token; // Making the token global
    console.log("Access Token:", response.data);
    next();
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response ? error.response.data : error.message
    );
    res
      .status(400)
      .json({ message: "Error fetching token", error: error.message });
  }
};

// STK Push function
const stkPush = async (req, res) => {
  const shortCode = 174379;
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  console.log("Request Body:", req.body);
  const passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const timestamp = moment().format("YYYYMMDDHHmmss");
  console.log("Timestamp:", timestamp);

  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );
  console.log("Password:", password);

  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: shortCode,
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://mydomain.com/pat",
    AccountReference: "onesso the third",
    TransactionDesc: "onesso the third",
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${global.token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("STK Push Response:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "STK Push Error:",
      error.response ? error.response.data : error.message
    );
    res.status(400).json({ message: "STK Push Error", error: error.message });
  }
};

module.exports = { createToken, stkPush };
