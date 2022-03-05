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

// GET HIGHEST AND LOWEST SALES BY SALES
router.get('/highest-lowest-total-sales',(request, response)=>{
    const db = new sqlite3.Database(DBSOURCE, (error)=>{
        if(error)
            response.status(500).json({message:'Failed to connect with database'});
        else{
            const data = {
                "highest_sales_countries": "",
                "lowest_sales_countries": ""
            }
            db.all('SELECT country, SUM(sale) as total_sales FROM Petroleum GROUP BY Country ORDER BY SUM(sale) DESC',[],(error, rows)=>{
                if(error)
                    response.status(500).json({message: 'Internal Server Error'});
                else
                    data["highest_sales_countries"] = rows.slice(0,3);
                    data["lowest_sales_countries"] = rows.slice(rows.length-3).reverse();
                    response.status(200).json(data);

            });
        }
        db.close();
    });
});

// GET AVERAGE SALE OF EACH PETROLEUM PRODUCT FOR 4 YEARS OF INTERVAL
router.get('/average-sale',(request, response)=>{
    const db = new sqlite3.Database(DBSOURCE, (error)=>{
        if(error)
            response.status(500).json({message:'Failed to connect with database'});
        else {
            db.all(`SELECT petroleum_product,
                CASE year 
                    WHEN 2007 then '2007-2010' 
                    WHEN 2008 then '2007-2010'
                    WHEN 2009 then '2007-2010'
                    WHEN 2010 then '2007-2010'
                    WHEN 2011 then '2011-2014'
                    WHEN 2012 then '2011-2014' 
                    WHEN 2013 then '2011-2014'
                    WHEN 2014 then '2011-2014'
                    ELSE year 
                END year,
                AVG(total) as Avg 
                FROM (SELECT petroleum_product, 
                    SUM(sale) as total, year FROM Petroleum GROUP BY petroleum_product, year HAVING sale != 0) GROUP BY petroleum_product, year BETWEEN 2007 AND 2010, year BETWEEN 2011 AND 2014 ORDER BY petroleum_product, year`,[],(error,rows)=>{
                if(error){
                    response.status(500).json({message: 'Internal Server Error'});
                }
                else {
                    response.status(200).json(rows);
                }
            });
        }
    });
});

module.exports = router;