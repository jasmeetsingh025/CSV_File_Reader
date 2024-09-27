import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import fileRoutes from "./src/routes/upload.route.js";

export const server = express();

// middleware setup
server.use(cors());
server.use(bodyParser.json());
server.use(cookieParser());
server.use(express.json());
server.set("view engine", "ejs");
server.use(expressEjsLayouts);
server.set("views", path.resolve("src", "views"));
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));

//routes
server.use("/", fileRoutes);

//below request handels the errors in the routes
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).render("error", {
    message: err.message || "An unexpected error occurred",
    statusCode: err.statusCode || 500,
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
