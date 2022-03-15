import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { createReadStream } from "fs";
import { pipeline } from "stream/promises";
import { join } from "path";

const app = express();
const port = 3000;

const logCookies = (req, res, next) => {
  const cookies = req.cookies;
  console.info(`Cookies read from client: ${JSON.stringify(cookies)}`);
  next();
};

app.use(morgan("short"));
app.use(cookieParser());
app.use(logCookies);
app.use(express.static("public"));

////////////////////////

// This end point ensures the client gets a regular Cookie accessable by client !
app.get("/cookie", (req, res) => {
  res.cookie("somesecret", "but readable by client js");
  res.sendStatus(200);
});

// This end point ensures the client gets a httpOnly Cookie
app.get("/http-only-cookie", (req, res) => {
  res.cookie("realsecret", "kungfu", { httpOnly: true });
  res.sendStatus(200);
});

// Ask server for cookies (all of them)
app.get("/reveal-secret", (req, res) => {
  const cookies = req.cookies;
  res.send(cookies);
});

// LETS PRETENT THIS IS ANOTHER SERVER END POINT JUST RECEIVING STUFF
// This image of arnold is returned as expected ;) =>>>>> but after we've checked our bate!!!
app.get("/arnold.jpg", async (req, res) => {
  const stolenCookiesFromClient = req?.query?.cookie;
  console.warn(
    `Stolen cookies:\n${
      stolenCookiesFromClient?.length
        ? stolenCookiesFromClient + "\n===> Thanks to Arnold ;) <==="
        : "no cookie received"
    }`
  );
  const fileLocation = join(process.cwd(), "src", "arnold.jpg");
  const fileStream = createReadStream(fileLocation);
  await pipeline(fileStream, res);
});

////////////
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
