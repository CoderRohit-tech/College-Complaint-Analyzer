const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const studentRoutes = require("./routes/studentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// MIDDLEWARES

// CORS
app.use(cors());

// JSON body parser
app.use(express.json());


 //  ROUTES

app.use("/api", studentRoutes);
app.use("/api", complaintRoutes);
app.use("/api", adminRoutes);


//   HOME / HEALTH CHECK

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "College Complaint AI Backend Running"
    });
});


//   DATABASE TEST

app.get("/api/test-db", async (req, res) => {
    try {

        const [rows] = await db.query(
            "SELECT 1 AS result"
        );

        return res.status(200).json({
            success: true,
            message: "MySQL connected successfully",
            data: rows
        });

    } catch (error) {

        console.error(
            "Database connection error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});


//   404 ROUTE
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


//   GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {

    console.error(
        "Global error:",
        err.stack
    );

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


//   START SERVER

app.listen(PORT, () => {
    console.log(
        `Server is running on port ${PORT}`
    );
});