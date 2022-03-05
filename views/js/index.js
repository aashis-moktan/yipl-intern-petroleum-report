$(document).ready(function(){
    fetchTotalSaleByPetroleumProduct();
    $('#total-sales-btn').on('click',function(){
        fetchTotalSaleByPetroleumProduct();
    });
    
    $('#highest-lowest-btn').on('click',function(){
        fetchHighestLowestSalesCountry();  
    });


    $('#average-sales-btn').on('click',()=>{
        $.ajax({
            type: "GET",
            url: "/api/report/average-sale",
            beforeSend: function(){

            },
            success: function(response){
                $('.average-report-box').html('');
                var table = document.createElement('TABLE');
                table.className = "table table-striped table-bordered";
                $(table).html('<tr><th>S/NO</th><th>Product</th><th>Year</th><th>Avg</th></tr>')
                response.forEach((item,index)=>{
                    var tr = document.createElement("TR");
                    var td_sno = document.createElement("TD");
                    td_sno.innerHTML = index + 1;
                    var td_product = document.createElement("TD");
                    td_product.innerHTML = item.petroleum_product;
                    var td_year = document.createElement("TD");
                    td_year.innerHTML = item.year;
                    var td_avg = document.createElement("TD");
                    td_avg.innerHTML = item.avg;
                    $(tr).append(td_sno);
                    $(tr).append(td_product);
                    $(tr).append(td_year);
                    $(tr).append(td_avg);
                    $(table).append(tr);
                });
                $('.average-report-box').html(table);
            }
        });
    });
});

function fetchTotalSaleByPetroleumProduct(){
    $.ajax({
        type: "GET",
        url: "/api/report/total-sale-by-petroleum-product",
        beforeSend: function(){

        },
        success: function(response){
            $('.sales-report-box').html('');
            var table = document.createElement('TABLE');
            table.className = "table table-striped table-bordered";
            $(table).html('<tr><th>S/NO</th><th>Petroleum product</th><th>Total sales</th></tr>')
            response.forEach((item,index)=>{
                var tr = document.createElement("TR");
                var td_sno = document.createElement("TD");
                td_sno.innerHTML = index + 1;
                var td_product = document.createElement("TD");
                td_product.innerHTML = item.petroleum_product;
                var td_sales = document.createElement("TD");
                td_sales.innerHTML = item.total_sale;
                $(tr).append(td_sno);
                $(tr).append(td_product);
                $(tr).append(td_sales);
                $(table).append(tr);
                $('.sales-report-box').html(table);
            })
        }
    });
}

function fetchHighestLowestSalesCountry(){
    $.ajax({
        type: "GET",
        url: "/api/report//highest-lowest-total-sales",
        beforeSend: function(){
        },
        success: function(response){
            $('.highest-report-box').html('');
            $('.lowest-report-box').html('');
            var table = document.createElement('TABLE');
            table.className = "table table-striped table-bordered";
            $(table).html('<tr><th>S/NO</th><th>Country</th><th>Total sales</th></tr>')
            response.highest_sales_countries.forEach((item,index)=>{
                var tr = document.createElement("TR");
                var td_sno = document.createElement("TD");
                td_sno.innerHTML = index + 1;
                var td_country = document.createElement("TD");
                td_country.innerHTML = item.country;
                var td_sales = document.createElement("TD");
                td_sales.innerHTML = item.total_sales;
                $(tr).append(td_sno);
                $(tr).append(td_country);
                $(tr).append(td_sales);
                $(table).append(tr);
            });
            $('.highest-report-box').html(table);

            var table = document.createElement('TABLE');
            table.className = "table table-striped table-bordered";
            $(table).html('<tr><th>S/NO</th><th>Country</th><th>Total sales</th></tr>')
            response.lowest_sales_countries.forEach((item,index)=>{
                var tr = document.createElement("TR");
                var td_sno = document.createElement("TD");
                td_sno.innerHTML = index + 1;
                var td_country = document.createElement("TD");
                td_country.innerHTML = item.country;
                var td_sales = document.createElement("TD");
                td_sales.innerHTML = item.total_sales;
                $(tr).append(td_sno);
                $(tr).append(td_country);
                $(tr).append(td_sales);
                $(table).append(tr);
                $('.lowest-report-box').html(table);
            });
        }
    })  
}