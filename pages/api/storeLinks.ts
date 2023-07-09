import clientPromise from "./_connector";

export default async (req, res) => {
  // console.log(req.body.data);
  const db = await clientPromise;

  if (req.body !== "" && req.body !== undefined) {
    const entry = await db
      .db("Data")
      .collection("getCodes")
      .insertOne(req.body.data);
    res.statusCode = 201;
    return res.json({
      status: "Successfully Uploaded to MongoDB",
    });
  }

  res.statusCode = 409;
  res.json({ error: "no_link_found", error_description: "No link found" });
};
