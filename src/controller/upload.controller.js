import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { Readable } from "stream";
import { header } from "express-validator";
const uploadedFileNames = []; //Creating array to contain names of uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This file contains functions for uploading and searching CSV files.

// The 'parseCsv' function is a helper function that reads a CSV file, parses it, and returns the headers and rows.
const parseCsv = (req, next, filePath) => {
  const results = [];
  const headers = [];

  const bufferStream = new Readable();
  bufferStream.push(req.file.buffer);
  bufferStream.push(null);

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headerList) => {
        headers.push(...headerList); // Capture the headers
      })
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // const json = { headers: headers, results: results };
        resolve({ headers, rows: results });
      })
      .on("error", (error) => {
        next(error);
      });
  });
};

// The 'uploadFile' function reads a CSV file, parses it, and stores the results in an array.
// The 'uploadFile' function is called when a new CSV file is uploaded. It reads the file, parses it, and stores the results in an array.
// It also adds the filename to an array of uploaded file names.

export const uploadFile = (req, res, next) => {
  const results = [];
  const filePath = "public/uploads/" + req.file.filename;
  //read the file

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file: " + err.message);
    }
    //parse the csv file
    parseCsv(req, res, filePath)
      .then(({ headers, rows }) => {
        results.push(rows);
        uploadedFileNames.push(req.file.filename);
        res.render("upload", { data: results, headers: headers, rows: rows });
        // return res.status(200).send(results);
      })
      .catch((error) => {
        next(error);
      });
  });
};

// The 'searchData' function reads the first uploaded CSV file, searches for a query in its rows, and returns the matching rows.
// The 'searchData' function is called when a search query is submitted. It reads the first uploaded CSV file, searches for a query in its rows, and returns the matching rows.

export const searchData = (req, res, next) => {
  const csvFilePath = "public/uploads/" + uploadedFileNames[0];
  const results = [];
  const headers = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("headers", (headerList) => {
      headers.push(...headerList); // Capture the headers
    })
    .on("data", (row) => {
      // Example filtering condition
      // Convert query and row values to lowercase for case-insensitive matching
      const isMatch = Object.values(row).some((value) =>
        value.toLowerCase().includes(req.query.query.toLowerCase())
      );
      if (isMatch) {
        results.push(row);
      }
    })
    .on("end", () => {
      res.render("searchResults", { headers: headers, filteredRows: results });
    })
    .on("error", (error) => {
      next(error);
    });
};
