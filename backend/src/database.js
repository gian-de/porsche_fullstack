import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
  })
  .promise();

// Reusable helper function to sql query by "model_name" and get all info & assets for said model
function queryAllDataByModelName(modelName) {
  return `
    SELECT models.*, images.id AS image_id, images.image_type, images.image_path
    FROM models
    LEFT JOIN images
    ON models.id = images.model_id
    WHERE models.model_name = '${modelName}';
  `;
}
// Reusable helper function to format the sql query into a easy-to-use JSON response for frontend
function formatModelsAndImages(rows) {
  const result = rows.reduce((acc, row) => {
    const {
      id,
      make,
      model_name,
      trim_name,
      generation,
      year,
      num_doors,
      convertible,
      drivetrain,
      engine_layout,
      zero_to_sixty,
      horsepower,
      weight,
      price,
      youtube_link,
      youtube_channel,
      description,
      author_credited,
      author_page_link,
      image_id,
      image_type,
      image_path,
    } = row;

    // Check if the current row is already in the accumulator
    const existingRow = acc.find((item) => item.id === id);
    if (existingRow) {
      // Add the image to the existing row
      existingRow.images.push({
        id: image_id,
        type: image_type,
        path: image_path,
      });
    } else {
      // Create a new row with the image
      const newRow = {
        id,
        make,
        model_name,
        trim_name,
        generation,
        year,
        num_doors,
        convertible,
        drivetrain,
        engine_layout,
        zero_to_sixty,
        horsepower,
        weight,
        price,
        youtube_link,
        youtube_channel,
        description,
        author_credited,
        author_page_link,
        images: [{ id: image_id, type: image_type, path: image_path }],
      };
      acc.push(newRow);
    }

    return acc;
  }, []);
  return result;
}

export async function queryAllModelsAndImages() {
  try {
    const [rows, fields] = await pool.query(`
    SELECT models.*, images.id AS image_id, images.image_type, images.image_path
    FROM models
    LEFT JOIN images
    ON models.id = images.model_id;
  `);
    const result = formatModelsAndImages(rows);
    console.log("result", result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllCaymans() {
  try {
    const q = queryAllDataByModelName("Cayman");
    const [rows, fields] = await pool.query(q);
    const result = formatModelsAndImages(rows);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllCarreras() {
  try {
    const q = queryAllDataByModelName("911");
    const [rows, fields] = await pool.query(q);
    const result = formatModelsAndImages(rows);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllTaycans() {
  try {
    const q = queryAllDataByModelName("Taycan");
    const [rows, fields] = await pool.query(q);
    const result = formatModelsAndImages(rows);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllPanameras() {
  try {
    const q = queryAllDataByModelName("Panamera");
    const [rows, fields] = await pool.query(q);
    const result = formatModelsAndImages(rows);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllCayennes() {
  try {
    const q = queryAllDataByModelName("Cayenne");
    const [rows, fields] = await pool.query(q);
    const result = formatModelsAndImages(rows);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllMacans() {
  try {
    const q = queryAllDataByModelName("Macan");
    const [rows, fields] = await pool.query(q);
    const result = formatModelsAndImages(rows);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllSupercars() {
  try {
    const [rows, fields] = await pool.query(`
      SELECT models.*, images.id AS image_id, images.image_type, images.image_path
      FROM models
      LEFT JOIN images
      ON models.id = images.model_id
      WHERE models.model_name IN ('918', 'Carrera GT');`);
    const result = formatModelsAndImages(rows);
    return result;
  } catch (err) {
    console.error(err);
  }
}
