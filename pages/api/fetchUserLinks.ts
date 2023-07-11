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
    const fetchUserLinkData = await db.db("Data").collection("users");
    const linkData = await fetchUserLinkData.find({}).toArray();

    
    const dataToBeSent = linkData.find((item) => item[req.body.data]);
    // console.log(dataToBeSent);

    if (dataToBeSent) {
      res.status(201).json(dataToBeSent[req.body.data]);
    } else {
      res.send(false);
    }
  } else {
    res.status(409).json({ error: "Send some Data when using POST" });
  }
};

export default cors(handler);
