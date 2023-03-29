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

export async function queryAllModelsAndImagesByFilters(formattedParams) {
  try {
    let q = `
    SELECT models.*, images.id AS image_id, images.image_type, images.image_path
    FROM models
    LEFT JOIN images
    ON models.id = images.model_id
  `;
    // variable to add the conditions
    let conditions = [];
    // variable to check if the "WHERE" clause has been added to the sql q already
    let hasWhereClause = false;

    if (formattedParams.between) {
      conditions.push(
        `models.${formattedParams.between.field} BETWEEN ${formattedParams.between.values[0]} AND ${formattedParams.between.values[1]}`
      );
    }
    // iterate through the keys of the formattedParams object passed in from the api endpoint
    Object.keys(formattedParams).forEach((key) => {
      let values = formattedParams[key];
      if (key === "sort" || !Array.isArray(values)) {
        // skip the "sort" property and non-array values
        return;
      }
      // map array and add placeholder for each value then combine into string seperated by comma
      let placeholders = values.map(() => "?").join(",");
      conditions.push(`models.${key} IN (${placeholders})`);
    });
    if (conditions.length > 0 && !hasWhereClause) {
      // add the WHERE clause to the q
      q += ` WHERE ${conditions.join(" AND ")}`;
      hasWhereClause = true;
    }

    // if sort is defined then append query (q) a ORDER BY statement
    if (formattedParams.sort) {
      q += ` ORDER BY models.${formattedParams.sort.field} ${formattedParams.sort.order}`;
    }

    // flatten the values into a single array
    let values = Object.values(formattedParams).flat();

    const [rows, fields] = await pool.query(q, values);
    const result = formatModelsAndImages(rows);
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
