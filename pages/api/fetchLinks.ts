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
      if (
        linkData[req.body.data].fromWhere === undefined ||
        linkData[req.body.data].fromWhere === null
      ) {
        console.log("I am in here");
        console.log(req.body.city);
        linkData[req.body.data].fromWhere = { city: [{ [req.body.city]: 1 }] };
        console.log(linkData[req.body.data]);
      } else {
        console.log("I am in else");
        const findIndex = linkData[req.body.data].fromWhere.city.findIndex(
          (cityData) => {
            return Object.keys(cityData).toString() === `${req.body.city}`;
          }
        );

        // console.log(findIndex);

        if (findIndex !== -1) {
          const getKeyName = Object.keys(
            linkData[req.body.data].fromWhere.city[findIndex]
          ).toString();

          const currentVal =
            linkData[req.body.data].fromWhere.city[findIndex][req.body.city];
          const newVal = currentVal + 1;
          linkData[req.body.data].fromWhere.city[findIndex][req.body.city] =
            newVal;

          // console.log(linkData[req.body.data].fromWhere.city);
        } else {
          linkData[req.body.data].fromWhere.city.push({ [req.body.city]: 1 });
        }
      }

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
