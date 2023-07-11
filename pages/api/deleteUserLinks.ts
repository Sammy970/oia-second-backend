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
    // console.log(req.body);
    const deleteUserLinkData = await db.db("Data").collection("users");
    const linkData = await deleteUserLinkData.find({}).toArray();

    const dataToBeSent = linkData.find((item) => item[req.body.email]);

    if (dataToBeSent) {
      //   console.log(dataToBeSent);
      const index = dataToBeSent[req.body.email].findIndex((item) =>
        item.hasOwnProperty(req.body.code)
      );

      //   console.log(index);

      if (index !== -1) {
        dataToBeSent[req.body.email].splice(index, 1);
        const result = await db
          .db("Data")
          .collection("users")
          .replaceOne({ _id: dataToBeSent["_id"] }, dataToBeSent);

        if (result.modifiedCount === 1) {
          const fetchLinkData = await db.db("Data").collection("getCodes");
          const linkData = await fetchLinkData.deleteOne({
            [req.body.code]: { $exists: true },
          });

          if (linkData.deletedCount === 1) {
            // console.log(linkData);
            // console.log(linkData);
            res.statusCode = 201;
            return res.json({
              status: "Successfully deleted",
            });
          } else {
            res.statusCode = 404;
            return res.json({
              error: "Not Deleted the code in getCodes Collection",
            });
          }
        }
      } else {
        res.send("Not found");
      }
    } else {
      res.send(false);
    }
  } else {
    return res.status(409).json({ error: "Send some Data when using POST" });
  }
};

export default cors(handler);
