const express = require('express');
const router = express.Router();

const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const analyzeComplaint = require('../services/aiService');

router.post('/complaints', authMiddleware, async (req, res) => {

    try {

        const studentId = req.student.id;

        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required'
            });
        }

        const aiResult = analyzeComplaint(title + " " + description);

        const category = aiResult.category;
        const sentiment = aiResult.sentiment;

        const sql = `
         INSERT INTO complaints
        (student_id, title, description, category, sentiment)
         VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
          studentId,
          title,
          description,
          category,
          sentiment
        ]);

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
               complaint: {
                    id: result.insertId,
                    title: title,
                    description: description,
                    category: category,
                    sentiment: sentiment,
                    status: 'Pending'
    }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


router.get("/my-complaints", authMiddleware, async(req, res)=>{
    try{

        const studentId = req.student.id;
        
        const sql = `SELECT * 
                     FROM complaints 
                     where student_id=?
                     ORDER BY created_at DESC`;

        const [rows] = await db.query(sql, [studentId]);
        
        res.status(200).json({
            success:true,
            complaints:rows
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