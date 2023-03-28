import { getAllCarreras } from "../database";

export const getAllCarrerasController = async (req, res) => {
  try {
    const data = await getAllCarreras();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
