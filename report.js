const express = require('express');
const app = express();
const reportRouter = require('./routes/report.route');

// router middleware
app.use('/api/report',reportRouter);

app.listen(8080,()=>{
    console.log('Server is running at port no 8080.....');
});
