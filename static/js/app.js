var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/16jlqCbsvF3OSEWRBnP6e2Tk6jcE7POf49UfC3t-93nk/edit?usp=sharing";
    
function init() {
  Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: loadData,
                   simpleSheet: true } )
}

window.addEventListener('DOMContentLoaded', init)

$(document).ready(function() {
    $('#results-table').DataTable({
        "scrollY": 420,
        "scrollCollapse": true,
        "paging": false,
        "ordering": false,
        "info":     false,
        "searching": false,
        "sScrollX": "100%"
    });
} );

var tableData = [];
var originalData = [];
var parseDate = d3.time.format("%m/%d/%Y").parse;
var formatDate = d3.time.format("%m/%d/%Y");
var formatTime = d3.time.format("%I:%M %p");

function loadData(data, tabletop) {
    
    originalData = data
    tableData = data
    // On load, populates table with today's classes
    var today = new Date();
    var date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    // console.log(date)
    // console.log(time.toLocaleString())

    // console.log(data)
    tableData = data.filter(event => {
        let eventdate = new Date(event.Date);
        return formatDate(eventdate) === formatDate(today)
    });
    tableData = tableData.filter(event => {
        eventdatetimestring = event.Date + " " + event.Time + " " + event.Timezone
        // console.log(eventdatetimestring)
        var eventdatetime = new Date(eventdatetimestring);
        // console.log('Local Time: ' + eventdatetime.toLocaleString())
        return eventdatetime.toLocaleString() >= today.toLocaleString()
    });

    // console.log(tableData)
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
            .append('option').attr("value", function (d) { return d; }).text(function(d){ return d.split(" @ ")[0];});
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
        var cell = row.append("td").attr("colspan", "8")
            cell.text("None found");
    }
    tableData.forEach(function(event) {
        // Append row
        var row = tbody.append("tr");
        // Append columns

        Object.entries(event).forEach(function([key, value]) {
            if (key != "Time" && key != "Timezone"){
            var cell = row.append("td");
            if (key == "DateTime"){
                var newvalue = new Date(value);
                // console.log(value)
                // console.log(newvalue)
                cell.html(formatTime(newvalue) + "<br/> (" + value.substring(11) + ")")
                // cell.text(formatTime(newvalue) + " (" + value.substring(11) + ")");
            } else if (key == "instructor"){
                var parts = value.split(" @ ");
                cell.append('a')
                .attr('href', parts[1])
                .attr('target','_blank')
                .append('text').html(parts[0]);
            } else if (key == "howto"){
                cell.append('a')
                .attr('href', value)
                .attr('target','_blank')
                .append('text').html("Link");                
            } else {
                cell.text(value);
            }
        }
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
        tableData = data.filter(event => {
            let eventdate = new Date(event.Date);
            return formatDate(eventdate) === dateValue
        });
    } else {
        tableData = data.filter(event => {
            let eventdate = new Date(event.Date);
            let today = new Date();
            return formatDate(eventdate) === formatDate(today)
        });
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
