import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

async function getModelsAndImages() {
  const pool = await mysql
    .createPool({
      host: "localhost",
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
    })
    .promise();

  try {
    const [rows, fields] = await pool.query(`
    SELECT models.*, images.id AS image_id, images.image_type, images.image_path
    FROM models
    LEFT JOIN images
    ON models.id = images.model_id;
  `);

    // Transform the rows into the desired format
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
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

// wrap the getModelsAndImages() in a a new async try/catch for error handling
export async function displayModelsAndImages() {
  try {
    const data = await getModelsAndImages();
    return data;
  } catch (error) {
    console.error(error);
  }
}

displayModelsAndImages();
