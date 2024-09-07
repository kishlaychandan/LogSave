import express from "express";
import morgan from "morgan";
import winston from "winston";

const app = express();
const port = process.env.PORT || 3000;
// Create a Winston logger instance for detailed logging
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

// Custom middleware to log request details
const requestLogger = (req, res, next) => {
    const logDetails = `${req.method} ${req.url} - IP: ${req.ip}`;
    logger.info(logDetails);
    next();
};

// Apply custom requestLogger middleware globally
app.use(requestLogger);

// Optional: Use Morgan for additional logging format (uncomment if needed)
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Sample routes
app.get("/", (req, res) => {
    logger.info("Root route accessed");
    res.sendStatus(200);
});

app.post("/abc", (req, res) => {
    logger.info("Post route /abc accessed");
    res.sendStatus(404);
});

// Server start
app.listen(port, () => {
    logger.info("Server is running on port 3000");
});
