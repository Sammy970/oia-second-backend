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
      if (req.body.osName !== undefined || req.body.osName !== null) {
        linkData[req.body.data].clicks = linkData[req.body.data].clicks + 1;
        if (
          linkData[req.body.data].fromWhere === undefined ||
          linkData[req.body.data].fromWhere === null
        ) {
          console.log("I am in here");
          // console.log(req.body.city);
          linkData[req.body.data].fromWhere = {
            city: [{ [req.body.city]: 1 }],
          };
          console.log(linkData[req.body.data]);
        } else if (
          linkData[req.body.data].fromWhere.city === undefined &&
          linkData[req.body.data].fromWhere.state === undefined &&
          linkData[req.body.data].fromWhere.country === undefined &&
          linkData[req.body.data].fromWhere.osName === undefined
        ) {
          linkData[req.body.data].fromWhere.city = [];
          linkData[req.body.data].fromWhere.state = [];
          linkData[req.body.data].fromWhere.country = [];
          linkData[req.body.data].fromWhere.osName = [];
        }

        console.log("I am in else");
        const findIndCity = linkData[req.body.data].fromWhere.city.findIndex(
          (cityData) => {
            return Object.keys(cityData).toString() === `${req.body.city}`;
          }
        );

        const findIndState = linkData[req.body.data].fromWhere.state.findIndex(
          (stateData) => {
            return Object.keys(stateData).toString() === `${req.body.state}`;
          }
        );

        const findIndCountry = linkData[
          req.body.data
        ].fromWhere.country.findIndex((countryData) => {
          return Object.keys(countryData).toString() === `${req.body.country}`;
        });

        const findIndOsName = linkData[
          req.body.data
        ].fromWhere.osName.findIndex((osNameData) => {
          return Object.keys(osNameData).toString() === `${req.body.osName}`;
        });

        // console.log(findIndex);
        // console.log(req.body.city);

        // City --------------------------------------------

        if (findIndCity !== -1) {
          const getKeyName = Object.keys(
            linkData[req.body.data].fromWhere.city[findIndCity]
          ).toString();

          const currentVal =
            linkData[req.body.data].fromWhere.city[findIndCity][req.body.city];
          const newVal = currentVal + 1;
          linkData[req.body.data].fromWhere.city[findIndCity][req.body.city] =
            newVal;
        } else {
          linkData[req.body.data].fromWhere.city.push({ [req.body.city]: 1 });
        }

        // State --------------------------------------------

        if (findIndState !== -1) {
          const getKeyName = Object.keys(
            linkData[req.body.data].fromWhere.state[findIndState]
          ).toString();

          const currentVal =
            linkData[req.body.data].fromWhere.state[findIndState][
              req.body.state
            ];
          const newVal = currentVal + 1;
          linkData[req.body.data].fromWhere.state[findIndState][
            req.body.state
          ] = newVal;
        } else {
          linkData[req.body.data].fromWhere.state.push({ [req.body.state]: 1 });
        }

        // Country --------------------------------------------

        if (findIndCountry !== -1) {
          const getKeyName = Object.keys(
            linkData[req.body.data].fromWhere.country[findIndCountry]
          ).toString();

          const currentVal =
            linkData[req.body.data].fromWhere.country[findIndCountry][
              req.body.country
            ];
          const newVal = currentVal + 1;
          linkData[req.body.data].fromWhere.country[findIndCountry][
            req.body.country
          ] = newVal;
        } else {
          linkData[req.body.data].fromWhere.country.push({
            [req.body.country]: 1,
          });
        }

        // osName --------------------------------------------

        if (findIndOsName !== -1) {
          const getKeyName = Object.keys(
            linkData[req.body.data].fromWhere.osName[findIndOsName]
          ).toString();

          const currentVal =
            linkData[req.body.data].fromWhere.osName[findIndOsName][
              req.body.osName
            ];
          const newVal = currentVal + 1;
          linkData[req.body.data].fromWhere.osName[findIndOsName][
            req.body.osName
          ] = newVal;
        } else {
          linkData[req.body.data].fromWhere.osName.push({
            [req.body.osName]: 1,
          });
        }
        // console.log(linkData);
      }

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
