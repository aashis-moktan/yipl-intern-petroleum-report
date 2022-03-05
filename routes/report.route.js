const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();
const data = require('./../data.json');

const DBSOURCE = "data.db";

// INSERTING DATA
router.post('/',(request, response)=>{
    const db = new sqlite3.Database(DBSOURCE, (error)=>{
        if(error){
            response.status(500).json({message:'Failed to connect to database'});
        }
        else {
            const query = `CREATE TABLE Petroleum (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER,
                petroleum_product TEXT,
                sale INTEGER,
                country TEXT
            )`;
            db.run(query, (error) => {
                if(error){
                    console.log(error);
                    response.status(409).json({message:'Table already exists'});
                    console.log(error);
                }
                else{
                    console.log('Table created successfully');
                    const insert = 'INSERT INTO Petroleum(year, petroleum_product, sale, country) VALUES (?,?,?,?)';
                    data.forEach(item=>{
                        db.run(insert, [Number(item.year), item.petroleum_product,item.sale,item.country]);
                    })
                    response.status(201).json({message:'Record inserted'});
                
                }
            });
            db.close();
        
        }
    });
});

// GET TOTAL SALE OF EACH PETROLIUM
router.get('/total-sale',(request, response)=>{
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

// GET HIGHEST AND LOWEST SALES
router.get('/lowest-highest-total',(request, response)=>{
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



/*
// GET ALL
router.get('/',(request, response)=>{
    const db = new sqlite3.Database(DBSOURCE,(err)=>{
        if(err){
            response.status(500).json({message:'Failed to connect to database'});
        }
        else {
            db.all('SELECT * FROM Petroleum',[],(err,rows)=>{
                if(err){
                    response.status(500).json({'message':'Internal Server Error'});
                }
                else{
                    response.status(200).json(rows);
                }
            });
        }
    })
});

// GET BY ID
router.get('/find/:id',(request, response)=>{
    const db = new sqlite3.Database(DBSOURCE, (err)=>{
        if(err){
            response.status(500).json({message:'Failed to connect to database'});
        }
        else {
            db.get('SELECT * FROM Petroleum WHERE id=?',[request.params.id],(error, rows)=>{
                if(error){
                    response.status(500).json({message: 'Internal Server Error'});
                }
                else {
                    if(rows == undefined){
                        response.status(404).json({message:'Data not found !'});
                    }
                    else{
                        response.status(200).json(rows);
                    }
                }
            });
        }
    });
});

// GET DISTINT
router.get('/get-total-sale', (request, response)=>{
    const db = new sqlite3.Database(DBSOURCE, (err)=>{
        if(err){
            response.status(500).json({message:'Failed to connect to database'});
        }
        else {
            db.all('SELECT petroleum_product, SUM(sale) as total FROM Petroleum GROUP BY petroleum_product ORDER BY petroleum_product',[],(err,rows)=>{
                if(err){
                    console.log(err);
                    response.status(500).json({message:'Internal sever error'});
                }
                else{
                    if(rows == undefined){
                        response.status(404).json({message:'Data not found !!!'});
                    }
                    else{
                        response.status(200).json(rows);
                    }
                }
            });
        }
    })
});

*/


module.exports = router;