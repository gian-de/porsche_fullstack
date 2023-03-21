import express from "express";
import mysql from "mysql2";
import * as dotenv from "dotenv";
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
        msrp,
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
          msrp,
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

    //   console.log(result.map((record) => record.images));
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

async function displayModelsAndImages() {
  try {
    const data = await getModelsAndImages();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

displayModelsAndImages();
