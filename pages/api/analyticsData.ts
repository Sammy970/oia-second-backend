import { NextApiRequest, NextApiResponse } from "next";
import microCors from "micro-cors";
import clientPromise from "./_connector";

const cors = microCors();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    // Handle preflight request
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).end();
    return;
  }

  const db = await clientPromise;

  if (req.body !== "" && req.body !== undefined) {
    // console.log(req.body.data);
    const fetchUserLinkData = await db.db("Data").collection("getCodes");
    const linkData = await fetchUserLinkData.findOne({
      [req.body.code]: { $exists: true },
    });

    if (linkData) {
      //   console.log(linkData[req.body.code].clicks);

      let cityData;
      if (linkData[req.body.code].fromWhere.city === undefined) {
        cityData = null;
      } else {
        cityData = linkData[req.body.code].fromWhere.city;
      }

      let stateData;
      if (linkData[req.body.code].fromWhere.state === undefined) {
        stateData = null;
      } else {
        stateData = linkData[req.body.code].fromWhere.state;
      }

      let objToBeSent = {
        clicks: linkData[req.body.code].clicks,
        fromWhere: linkData[req.body.code].fromWhere,
        city: cityData,
        state: stateData,
      };

      // console.log(objToBeSent);

      res.status(201).json(objToBeSent);
    } else {
      res.send([]);
    }
  } else {
    res.status(409).json({ error: "Send some Data when using POST" });
  }
};

export default cors(handler);
