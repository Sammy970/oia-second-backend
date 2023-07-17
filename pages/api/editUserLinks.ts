import { NextApiRequest, NextApiResponse } from "next";
import microCors from "micro-cors";
import clientPromise from "./_connector";
import { nanoid } from "nanoid";

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
    // console.log(req.body);
    const fetchUserLinkData = await db.db("Data").collection("users");
    const linkData = await fetchUserLinkData.find({}).toArray();

    const dataToBeSent = linkData.find((item) => item[req.body.email]);
    // console.log(dataToBeSent);
    // console.log(req.body.data);

    let index;
    if (dataToBeSent) {
      index = dataToBeSent[req.body.email].findIndex(
        (obj) => req.body.code in obj
      );

      dataToBeSent[req.body.email][index] = req.body.data;

      // console.log(dataToBeSent);

      const result = await db
        .db("Data")
        .collection("users")
        .replaceOne({ _id: dataToBeSent["_id"] }, dataToBeSent);

      // console.log(result);
      if (result.modifiedCount === 1) {
        const findId = await db
          .db("Data")
          .collection("getCodes")
          .findOne({
            [req.body.code]: { $exists: true },
          });

        if (findId) {
          dataToBeSent[req.body.email][index][req.body.code].clicks =
            findId[req.body.code].clicks;

          dataToBeSent[req.body.email][index][req.body.code].fromWhere =
            findId[req.body.code].fromWhere;

          const data = {
            _id: findId["_id"],
            [req.body.code]: dataToBeSent[req.body.email][index][req.body.code],
          };

          const result = await db.db("Data").collection("getCodes").replaceOne(
            {
              _id: findId["_id"],
            },
            data
          );

          if (result.modifiedCount === 1) {
            res.statusCode = 201;
            return res.json({
              status: "Successfully Edited in MongoDB",
            });
          }
        } else {
          return res.json({
            status: "Error in findId",
          });
        }
      } else {
        return res.json({ status: "Nothing Changed. Everything is Same" });
      }
    } else {
      console.log("I am in here");
      return res.send([]);
    }
  } else {
    return res.status(409).json({ error: "Send some Data when using POST" });
  }
};

export default cors(handler);
