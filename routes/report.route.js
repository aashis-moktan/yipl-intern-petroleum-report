const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();
const data = require('./../data.json');
const DBSOURCE = "data.db";


// GET TOTAL SALE OF EACH PETROLIUM
router.get('/total-sale-by-petroleum-product',(request, response)=>{
    const db = new sqlite3.Database(DBSOURCE,(error)=>{
        if(error){
            response.status(500).json({message:'Failed to connect with database'});
        }
        else {
            db.all('SELECT petroleum_product, SUM(sale) as total_sale FROM Petroleum GROUP BY petroleum_product',[],(error,rows)=>{
                if(error){
                    response.status(500).json({'message': 'Internal Server Error'});
                }
                else {
                    response.status(200).json(rows);
                }
            });
        }
    });
    db.close();
});

module.exports = router;