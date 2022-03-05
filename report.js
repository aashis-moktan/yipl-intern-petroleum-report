const express = require('express');
const app = express();
const reportRouter = require('./routes/report.route');
const cors = require('cors');
const port = process.env.PORT || 8080;

// setting view engine
app.set('views','views');
app.set('view engine','pug');

// enable cors
app.use(cors());

// router middleware
app.use('/api/report',reportRouter);
app.use(express.static("views"));


app.get('/',(request, response)=>{
    response.render('html/index');
});
app.get('*',(request,response)=>{
    response.status(404).send('Oops! page not found');
});

app.listen(port,()=>{
    console.log('Server is running at port no 8080.....');
});
