const functions = require("firebase-functions");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const cors = require("cors")({ origin: true });

const creds = require("./serviceAccount.json"); // Update this path
const SPREADSHEET_ID = {
  "pasha-fabrics-india": "1uFofefamtLM9qEus54h2GoZcd7ovMk0yGqH6W_CfX_I",
  kurtajee: "1FiMdmYgKvIwjfswTN0U2C8_VLbTDZz1M7hzFVmgkujs",
};
const SHEET_ID = 0;

exports.addMobileNumberToGoogleSheets = functions.https.onRequest(
  (req, res) => {
    cors(req, res, async () => {
      try {
        // Get the mobile number from the request body
        const mobileNumber = req.body.mobileNumber;
        const type = req.body.type || "pasha-fabrics-india";
        // Authenticate with Google Sheets API using OAuth 2.0 credentials
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID?.[type]);
        await doc.useServiceAccountAuth(creds);

        await doc.loadInfo(); // Loads document properties and worksheets
        const sheet = doc.sheetsById[SHEET_ID];
        const date = new Date().toLocaleString();
        await sheet.addRow([mobileNumber, date]);

        // Send a success response with the new row's data
        res.status(200).send(`${mobileNumber} added`);
      } catch (err) {
        // Handle any errors and send an error response
        console.error(err);
        res.status(500).send("Error adding mobile number to Google Sheets.");
      }
    });
  }
);
