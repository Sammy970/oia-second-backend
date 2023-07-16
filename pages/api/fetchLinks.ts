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
        const usersDB = await db.db("Data").collection("users");
        const documents = await usersDB.find({}).toArray();

        let index;
        let email;
        documents.map((data) => {
          index = data[Object.keys(data)[1]].findIndex((d) =>
            d.hasOwnProperty(req.body.data)
          );
          if (index !== -1) {
            email = Object.keys(data)[1];
            return;
          }
        });

        // console.log(index);
        // console.log(email);

        const indexOfDoc = documents.findIndex((d) => d.hasOwnProperty(email));

        const objToBeUpdated =
          documents[indexOfDoc][email][index][req.body.data];
        objToBeUpdated.clicks = objToBeUpdated.clicks + 1;

        // console.log(documents[indexOfDoc]._id);

        const result = await usersDB.replaceOne(
          {
            _id: documents[indexOfDoc]._id,
          },
          documents[indexOfDoc]
        );

        if (result.modifiedCount === 1) {
          res.statusCode = 201;
          return res.json(linkData);
        } else {
          return res.json({ stauts: "Error in updating clicks" });
        }
      } else {
        console.log("Error in updating clicks");
      }
    } else {
      res.statusCode = 404;
      return res.json({ error: "Code not found" });
    }
  } else {
    res.statusCode = 409;
    return res.json({ error: "Send some Data when using Post" });
  }
};
