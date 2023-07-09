import clientPromise from "./_connector";

export default async (req, res) => {
  await clientPromise;

  res.status(200).json({ name: "John Doe" });
};
