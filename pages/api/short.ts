import clientPromise from "./_connector";

export default async (req, res) => {
  console.log(req.body.link);
  const db = await clientPromise;

  if (req.body !== "" && req.body !== undefined) {
    const entry = await db
      .db("Data")
      .collection("users")
      .insertOne(req.body.link);
    res.statusCode = 201;
    return res.json({
      short_link: `${process.env.VERCEL_URL}/r/${entry.insertedId}`,
    });
  }

  res.statusCode = 409;
  res.json({ error: "no_link_found", error_description: "No link found" });
};
