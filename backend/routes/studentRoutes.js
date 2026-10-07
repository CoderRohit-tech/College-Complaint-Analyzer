const express = require("express");
const router = express.Router();

const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


 //  STUDENT REGISTER

router.post("/register", async (req, res) => {
    try {

        let { name, email, password } = req.body;

        // Check fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Remove unnecessary spaces
        name = name.trim();
        email = email.trim().toLowerCase();

        // Validate name
        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 2 characters"
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name cannot exceed 100 characters"
            });
        }

        // Validate email
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }


         //  CHECK DUPLICATE EMAIL

        const checkSql = `
            SELECT id
            FROM students
            WHERE email = ?
            LIMIT 1
        `;

        const [existingStudent] = await db.query(
            checkSql,
            [email]
        );

        if (existingStudent.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }


         //  HASH PASSWORD

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


         //  INSERT STUDENT

        const sql = `
            INSERT INTO students
            (name, email, password)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(
            sql,
            [
                name,
                email,
                hashedPassword
            ]
        );


        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            studentId: result.insertId
        });

    } catch (error) {

        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to register student"
        });
    }
});


  // STUDENT LOGIN


router.post("/login", async (req, res) => {
    try {

        let { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Normalize email
        email = email.trim().toLowerCase();


        
        //   FIND STUDENT
        

        const sql = `
            SELECT
                id,
                name,
                email,
                password

            FROM students

            WHERE email = ?

            LIMIT 1
        `;

        const [rows] = await db.query(
            sql,
            [email]
        );


        // Student not found
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const student = rows[0];


       
        //   PASSWORD CHECK
       

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }



        //   GENERATE JWT

     const token = jwt.sign(
            {
                id: student.id,
                role: "student"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        //   RESPONSE

        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            student: {
                id: student.id,
                name: student.name,
                email: student.email
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to login"
        });
    }
});


module.exports = router;