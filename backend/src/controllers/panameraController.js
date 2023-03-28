import { getAllPanameras } from "../database";

export const getAllPanamerasController = async (req, res) => {
  try {
    const data = await getAllPanameras();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};
