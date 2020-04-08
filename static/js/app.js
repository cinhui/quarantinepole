var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/16jlqCbsvF3OSEWRBnP6e2Tk6jcE7POf49UfC3t-93nk/edit?usp=sharing";
    
function init() {
  Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: loadData,
                   simpleSheet: true } )
}

window.addEventListener('DOMContentLoaded', init)

var tableData = [];
var originalData = [];

function loadData(data, tabletop) {
    
    originalData = data
    tableData = data
    // On load, populates table with today's classes
    var today = new Date();
    var date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // console.log(date)
    // console.log(time)

    // console.log(data)

    tableData = data.filter(event => event.date === date);
    tableData = data.filter(event => event.time >= time);
    populateTable()
    // Populate dropdown menus
    var categoryOptions = Array.from(new Set(data.map(item=>item.category)));
    categoryOptions.unshift("");
    var categoryList = d3.select("#categoryvalue");
    categoryList.selectAll('option').data(categoryOptions).enter()
            .append('option').attr("value", function (d) { return d; }).text(function(d){ return d;});
    // console.log(categoryOptions);

    var instructorOptions = Array.from(new Set(data.map(item=>item.instructor)));
    instructorOptions.unshift("");
    var instructorList = d3.select("#instructorvalue");
    instructorList.selectAll('option').data(instructorOptions).enter()
            .append('option').attr("value", function (d) { return d; }).text(function(d){ return d;});
    // console.log(instructorOptions);

   }

// Function to populate the results table
function populateTable(){
    // Remove previous tbody
    var tbody = d3.select("tbody");
    tbody.remove();
    var table = d3.select("#results-table");
    // Append new tbody
    table.append("tbody");
    tbody = d3.select("tbody");

    if (Object.entries(tableData).length === 0){
        var row = tbody.append("tr");
        var cell = row.append("td").attr("colspan", "6")
            cell.text("None found");
    }
    tableData.forEach(function(event) {
        // Append row
        var row = tbody.append("tr");
        // Append columns
        Object.entries(event).forEach(function([key, value]) {
            var cell = row.append("td");
            cell.text(value);
        });
    });

}

// When search button is pressed
var searchTableButton = d3.select("#search-btn");
searchTableButton.on("click", function() {

    d3.event.preventDefault();
    data = originalData
    tableData = data
    // Get inputs
    var dateValue = d3.select("#datevalue").property("value");
    var categoryValue = d3.select("#categoryvalue").property("value");
    var instructorValue = d3.select('#instructorvalue').property("value");

    // console.log(dateValue);
    // console.log(categoryValue);
    // console.log(instructorValue);   

    if (dateValue != "" ){
        tableData = data.filter(event => event.date === dateValue);
    } else {
        tableData = data;
    }

    if (categoryValue != "All Classes" ){
        tableData = tableData.filter(event => event.category === categoryValue);
    } else {
        tableData;
    }

    if (instructorValue != "All Instructors" ){
        tableData = tableData.filter(event => event.instructor === instructorValue);
    } else {
        tableData;
    }
    
    populateTable();
});  
