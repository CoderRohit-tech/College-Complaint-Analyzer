const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const analyzeComplaint = require("../services/aiService");


//   SUBMIT COMPLAINT

router.post("/complaints", authMiddleware, async (req, res) => {
    try {

        // Student ID comes from JWT
        const studentId = req.student.id;

        let { title, description } = req.body;

        // Check required fields
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        // Remove unnecessary spaces
        title = title.trim();
        description = description.trim();

        // Check empty strings
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description cannot be empty"
            });
        }

        // Length validation
        if (title.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Title must contain at least 5 characters"
            });
        }

        if (title.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 150 characters"
            });
        }

        if (description.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Description must contain at least 10 characters"
            });
        }

        if (description.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Description cannot exceed 2000 characters"
            });
        }


        //   AI ANALYSIS

        const complaintText = `${title} ${description}`;

        const aiResult = analyzeComplaint(complaintText);

        const category = aiResult.category || "Other";
        const sentiment = aiResult.sentiment || "Neutral";
        const priority = aiResult.priority || "Medium";
        const summary = aiResult.summary || description.substring(0, 200);


        //   SAVE COMPLAINT

        const sql = `
            INSERT INTO complaints
            (
                student_id,
                title,
                description,
                category,
                sentiment,
                priority,
                summary
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            studentId,
            title,
            description,
            category,
            sentiment,
            priority,
            summary
        ]);


         //  RESPONSE

        return res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",

            complaint: {
                id: result.insertId,
                title,
                description,
                category,
                sentiment,
                priority,
                summary,
                status: "Pending"
            }
        });

    } catch (error) {

        console.error("Submit complaint error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit complaint"
        });
    }
});


//   GET MY COMPLAINTS

router.get(
    "/my-complaints",
    authMiddleware,
    async (req, res) => {

        try {

            // Student ID from JWT
            const studentId = req.student.id;

            const sql = `
                SELECT
                    id,
                    title,
                    description,
                    category,
                    sentiment,
                    priority,
                    summary,
                    status,
                    created_at

                FROM complaints

                WHERE student_id = ?

                ORDER BY created_at DESC
            `;

            const [rows] = await db.query(
                sql,
                [studentId]
            );

            return res.status(200).json({
                success: true,
                count: rows.length,
                complaints: rows
            });

        } catch (error) {

            console.error("Get complaints error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch complaints"
            });
        }
    }
);


module.exports = router;