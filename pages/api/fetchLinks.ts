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
      linkData[req.body.data].clicks = linkData[req.body.data].clicks + 1;

      // console.log(linkData);

      const result = await db
        .db("Data")
        .collection("getCodes")
        .replaceOne({ _id: linkData["_id"] }, linkData);

      if (result.modifiedCount === 1) {
        res.statusCode = 201;
        return res.json(linkData);
      } else {
        console.log("Error in updating clicks");
      }
    } else {
      res.statusCode = 404;
      return res.json({ error: "Code not found" });
    }
  } else {
    res.statusCode = 400;
    return res.json({ error: "Send some Data when using Post" });
  }
};
