import clientPromise from "./_connector";

export default async (req, res) => {
  // console.log(req.body.data);
  const db = await clientPromise;

  if (req.body !== "" && req.body !== undefined) {
    const fetchLinkData = await db.db("Data").collection("getCodes");
    const linkData = await fetchLinkData.findOne({
      [req.body.data]: { $exists: true },
    });
    if (linkData !== null) {
      // console.log(linkData);
      res.statusCode = 201;
      return res.json(linkData);
    } else {
      res.statusCode = 404;
      return res.json({ error: "Code not found" });
    }
  }

  res.statusCode = 409;
  res.json({ error: "Send some Data when using Post" });
};
