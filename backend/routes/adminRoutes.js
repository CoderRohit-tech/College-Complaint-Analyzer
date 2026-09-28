const express = require('express');
const db = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/admin/login', async(req, res)=>{
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and Password are required"
            });
        }


        const sql = "SELECT * FROM admin WHERE email = ?";
        const [rows] = await db.query(sql, [email]);
        // console.log(rows);

if(rows.length === 0){
    return res.status(401).json({
        success:false,
        message:"Invalid email or password"
    });
}

const admin = rows[0];

const passwordMatch = await bcrypt.compare(password, admin.password);

if(!passwordMatch){
    return res.status(401).json({
       success:false,
       message:"Invalid email or password"
    });
}

// jwt generate
const token = jwt.sign(
    {
     id:admin.id,
     role:"admin"
    },
    
    process.env.JWT_SECRET,

    {
        expiresIn:"1h"
    }
 );

res.status(201).json({
    success:true,
    message:"Login Successfully",
    token : token,
    admin:{
        id:admin.id,
        name:admin.name,
        email:admin.email
    }
});

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }

});

router.get('/admin/complaints', adminMiddleware, async(req, res)=>{
    try{

        const sql = `SELECT 
                         complaints.id,
                         complaints.title,
                         complaints.description,
                         complaints.category,
                         complaints.sentiment,
                         complaints.status,
                         complaints.created_at,
                         students.name AS student_name,
                         students.email AS student_email
                    FROM complaints
                    JOIN students
                    ON complaints.student_id = students.id
                    ORDER BY complaints.created_at DESC     
                    `;

        const [rows] = await db.query(sql);

          res.status(200).json({
            success: true,
            complaints: rows
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
});

router.put('/admin/complaints/:id/status', adminMiddleware, async(req, res)=>{
    try{

        const complaintId = req.params.id;
        const {status} = req.body;

        // Check valid status
        if(status !== "Pending" && status !== "In Progress" && status !== "Resolved"){
            return res.status(400).json({
                success:false,
                message:"Invalid Status"
            });
        }

        const sql = `UPDATE complaints
                     set status = ?
                     where id = ?
                     `;

        const [result] =  await db.query(sql, [status, complaintId]);         
        
        if(result.affectedRows === 0){
            return res.status(404).json({
                success:false,
                message:"Complaint not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"Complaint updated successfully"
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
});

router.get("/admin/dashboard", adminMiddleware, async(req, res)=>{
    try{
        
        const sql = `
                     SELECT count(*) AS total,
                        SUM(status = 'Pending') AS pending,
                        SUM(status = 'In Progress') AS in_progress,
                        SUM(status = 'Resolved') AS resolved
                     FROM complaints
                     `;

         const [rows] = await db.query(sql);
         
         res.status(200).json({
            success:true,
            dashboard:rows[0]
         });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
});



module.exports = router;