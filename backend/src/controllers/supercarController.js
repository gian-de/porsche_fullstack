import { getAllSupercars } from "../database";

export const getAllSupercarsController = async (req, res) => {
  try {
    const data = await getAllSupercars();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
