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
        // console.log(req.body.city);
        linkData[req.body.data].fromWhere = { city: [{ [req.body.city]: 1 }] };
        console.log(linkData[req.body.data]);
      } else if (
        linkData[req.body.data].fromWhere.city === undefined &&
        linkData[req.body.data].fromWhere.state === undefined
      ) {
        linkData[req.body.data].fromWhere.city = [];
        linkData[req.body.data].fromWhere.state = [];
      }

      console.log("I am in else");
      const findIndCity = linkData[req.body.data].fromWhere.city.findIndex(
        (cityData) => {
          return Object.keys(cityData).toString() === `${req.body.city}`;
        }
      );

      const findIndState = linkData[req.body.data].fromWhere.state.findInd(
        (stateData) => {
          return Object.keys(stateData).toString() === `${req.body.state}`;
        }
      );

      // console.log(findIndex);
      // console.log(req.body.city);

      if (findIndCity !== -1) {
        const getKeyName = Object.keys(
          linkData[req.body.data].fromWhere.city[findIndCity]
        ).toString();

        const currentVal =
          linkData[req.body.data].fromWhere.city[findIndCity][req.body.city];
        const newVal = currentVal + 1;
        linkData[req.body.data].fromWhere.city[findIndCity][req.body.city] =
          newVal;

        // console.log(linkData[req.body.data].fromWhere.city);
      } else {
        linkData[req.body.data].fromWhere.city.push({ [req.body.city]: 1 });
      }

      if (findIndState !== -1) {
        const getKeyName = Object.keys(
          linkData[req.body.data].fromWhere.state[findIndState]
        ).toString();

        const currentVal =
          linkData[req.body.data].fromWhere.state[findIndState][req.body.state];
        const newVal = currentVal + 1;
        linkData[req.body.data].fromWhere.state[findIndState][req.body.state] =
          newVal;

        // console.log(linkData[req.body.data].fromWhere.city);
      } else {
        linkData[req.body.data].fromWhere.state.push({ [req.body.state]: 1 });
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
