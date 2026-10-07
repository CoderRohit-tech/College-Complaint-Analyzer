const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Valid complaint statuses
const VALID_STATUSES = [
    "Pending",
    "In Progress",
    "Resolved"
];


 //  ADMIN LOGIN


router.post("/admin/login", async (req, res) => {
    try {
        // Get data from request
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find admin
        const sql = `
            SELECT id, name, email, password
            FROM admin
            WHERE email = ?
            LIMIT 1
        `;

        const [rows] = await db.query(sql, [email]);

        // Admin not found
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const admin = rows[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: admin.id,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


  // GET ALL COMPLAINTS


router.get(
    "/admin/complaints",
    adminMiddleware,
    async (req, res) => {
        try {

            const sql = `
                SELECT
                    complaints.id,
                    complaints.title,
                    complaints.description,
                    complaints.category,
                    complaints.sentiment,
                    complaints.priority,
                    complaints.status,
                    complaints.created_at

                FROM complaints

                ORDER BY complaints.created_at DESC
            `;

            const [rows] = await db.query(sql);

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



//   UPDATE COMPLAINT STATUS

router.put(
    "/admin/complaints/:id/status",
    adminMiddleware,
    async (req, res) => {
        try {

            const complaintId = Number(req.params.id);
            const { status } = req.body;

            // Validate complaint ID
            if (!Number.isInteger(complaintId) || complaintId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid complaint ID"
                });
            }

            // Validate status
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status",
                    allowedStatuses: VALID_STATUSES
                });
            }

            // Update complaint
            const sql = `
                UPDATE complaints
                SET status = ?
                WHERE id = ?
            `;

            const [result] = await db.query(
                sql,
                [status, complaintId]
            );

            // Complaint doesn't exist
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Complaint not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Complaint status updated successfully",
                complaintId,
                status
            });

        } catch (error) {
            console.error("Update complaint error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to update complaint"
            });
        }
    }
);



//   ADMIN DASHBOARD

router.get(
    "/admin/dashboard",
    adminMiddleware,
    async (req, res) => {
        try {

            const sql = `
                SELECT
                    COUNT(*) AS total,

                    COALESCE(
                        SUM(status = 'Pending'),
                        0
                    ) AS pending,

                    COALESCE(
                        SUM(status = 'In Progress'),
                        0
                    ) AS in_progress,

                    COALESCE(
                        SUM(status = 'Resolved'),
                        0
                    ) AS resolved

                FROM complaints
            `;

            const [rows] = await db.query(sql);

            return res.status(200).json({
                success: true,
                dashboard: rows[0]
            });

        } catch (error) {
            console.error("Dashboard error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch dashboard data"
            });
        }
    }
);


module.exports = router;