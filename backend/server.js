const express = require('express');
const cors = require("cors");
const db = require('./db');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const studentRoutes = require("./routes/studentRoutes");
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use(cors());
app.use(express.json());
app.use('/api', studentRoutes);
app.use('/api', complaintRoutes);
app.use('/api', adminRoutes);

app.get("/", (req, res) =>{
     res.send('College Complaint AI Backend Running');
});

app.get('/api/test-db', async(req, res)=>{
    try{
        const [rows] = await db.query("SELECT 1 AS result");
        res.json({
            success: true,
            message: 'MySQL connected successfully',
            data: rows
        });
    }catch(error){
       console.error(error);
       res.status(500).json({
         success: false,
         message: 'MySQL connected failed',
       });
    }
});


app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
});