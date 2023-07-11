import clientPromise from "./_connector";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  // console.log(req.body);
  const db = await clientPromise;

  if (req.body !== "" && req.body !== undefined) {
    const entry = await db
      .db("Data")
      .collection("getCodes")
      .insertOne(req.body.data);

    const entry2Users = await db
      .db("Data")
      .collection("users")
      .find({})
      .toArray();

    const dataToBeSent = entry2Users.find((item) => item[req.body.email]);
    if (dataToBeSent) {
      console.log("Found it");
      console.log(dataToBeSent);
      dataToBeSent[req.body.email].push(req.body.data2);

      const result = await db
        .db("Data")
        .collection("users")
        .replaceOne({ _id: dataToBeSent["_id"] }, dataToBeSent);

      if (result.modifiedCount === 1) {
        res.statusCode = 201;
        return res.json({
          status: "Successfully Uploaded to MongoDB",
        });
      }
    } else {
      console.log("Not Found it");
      // console.log(dataToBeSent);
      const newUsersEntry = await db
        .db("Data")
        .collection("users")
        .insertOne(req.body.newUsersData);
      if (newUsersEntry.acknowledged === true) {
        res.statusCode = 201;
        return res.json({
          status: "Successfully added new user data to MongoDB",
        });
      }
    }

    // res.statusCode = 201;
    // return res.json({
    //   status: "Successfully Uploaded to MongoDB",
    // });
  }

  res.statusCode = 409;
  res.json({ error: "no_link_found", error_description: "No link found" });
};
