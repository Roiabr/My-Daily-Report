const path = require("path");
require("dotenv").config({ path: "./.env" });
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

(async function run() {
  console.log("Running daily");

  const locationRequest = await fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/IL/search?q=Lod&apikey=${process.env.ACCUWEATHER_API_KEY}`
  );
  const locationData = await locationRequest.json();
  const locationKey = locationData[0].Key;

  const ForecastRequest = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${process.env.ACCUWEATHER_API_KEY}&metric=true`
  );
  const ForecastData = await ForecastRequest.json();

  const temp = ForecastData.DailyForecasts[0].Temperature;

  //   console.log(ForecastData);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER_EMAIL,
      pass: process.env.MAIL_USER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Daily Report 👻" <Daliy@Report.com>', // sender address
    to: "roiabr15@gmail.com", // list of receivers
    subject: "Weather Daily Report  ✔", // Subject line
    text: "Weather Daily Report ", // plain text body
    html: `
        <h1>Weather Daily Report </h1>
        <p>Forecast: ${ForecastData.Headline.Text}</p>
        <p>Min: ${temp.Minimum.Value} ℃</p>
        <p>Max: ${temp.Maximum.Value} ℃</p>
    `,
  });
})();

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport

//   // send mail with defined transport object

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);
