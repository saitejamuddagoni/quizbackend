const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutes");
const teacherRoutes = require('./routes/teacherRoutes');
const examRoutes = require('./routes/examRoutes');
const paymentRoutes = require("./routes/paymentRoutes")
const {authorize,authenticate} = require("./middlewares/authMiddleware")
const app = express();


// Connect to the database
connectDB();
app.use(cors());


app.use(morgan("combined"));
app.use(express.json());

// Enable CORS for all routes


app.use('/api/auth', authRoutes);

// Use authentication middleware for all teacher routes
app.use('/api/teacher', authenticate, authorize('teacher'),teacherRoutes);//

// Use authentication middleware for all exam routes
app.use('/api/exams', authenticate, authorize('student'),examRoutes);//

// Use authentication and authorization middleware for all payment routes
app.use('/api/payments', authenticate, authorize('teacher','student'),paymentRoutes);// 

app.use("/api/admin",adminRoutes)//authenticate, authorize("admin") ,


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
