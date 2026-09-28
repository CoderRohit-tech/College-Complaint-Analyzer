const express = require('express');
const router = express.Router();
const db = require("../db")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register',  async(req, res)=>{
    try{
       const {name, email, password} = req.body;

       if(!name || !email || !password){
            return res.status(400).json({
             success:false,
             message:"All fields are required"
          });
       }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO students (name, email, password) VALUES (?, ?, ?)`;

    const [result] = await db.query(sql, [
         name,
         email,
         hashedPassword
       ]);

       res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            studentId: result.insertId
        });


 
    }catch(error){
       console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
    
});


router.post('/login', async(req, res)=>{
     try{

        const {email, password} = req.body;

        // Check email aur password entered or not
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // Find student by email
        const sql = "SELECT * FROM students where email=?";

        const [rows] = await db.query(sql, [email]);

        //Email not match
        if(rows.length === 0){
          return res.status(401).json({
            success:false,
            message:"Invalid email aur password"
          });   
        }

        const student = rows[0];

        //Password compare
        const passwordMatch = await bcrypt.compare(password, student.password);

        //Password match or not
        if(!passwordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        // JWT token generate
        const token = jwt.sign({
            id:student.id,
            role:"student"
           },
           process.env.JWT_SECRET,
           {
            expiresIn:"1h"
           }

     );

        res.status(200).json({
            success:true,
            message:"Login Successfully",
            token:token,
            student:{
                id:student.id,
                name:student.name,
                email:student.email
            }
        });


     }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Server error",
        });
     }
});

module.exports = router;