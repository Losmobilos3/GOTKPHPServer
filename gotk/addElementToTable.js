// Define the URL endpoint for the GET request
const url = 'http://' + window.location.host + '/getCollectedData/';

latestIndex = -1;

function removePrefixHeucod(text) {
    let lastIndex = text.lastIndexOf(".");
    let result = text.substring(lastIndex + 1);
    return result;
}

function addRowsToTable() {
    // Make a GET request using fetch
    fetch(url)
        .then(response => {
            // Check if the response is successful (status code 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON response
            return response.json();
        })
        .then(data => {

            var table = document.getElementById("myTable");

            // Loop through data and add rows
            for (let i = latestIndex; i < data.length; i++) {
                const item = data[i];
                
                // Skips the previously entered row
                if (i > latestIndex) {
                    var row = table.insertRow(-1); // Insert new row at the end

                    // Insert cells into the row
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);

                    // Populate cells with data
                    cell1.innerHTML = item.id;
                    cell2.innerHTML = convertTimestamp(item.timeStamp);
                    cell3.innerHTML = removePrefixHeucod(item.eventType);

                    // Saves the last index
                    latestIndex = i;
                }
            };
        })
}

function convertTimestamp(timestamp) {
    // Create a new Date object with the timestamp (in milliseconds)
    var date = new Date(timestamp * 1000);

    // Get the date and time components from the Date object
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Month starts from 0
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);

    // Construct the human-readable date and time string
    var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    // Return the formatted date and time string
    return formattedDateTime;
}

function convertTimestampOnCurrentDay(timestamp) {
    // Create a new Date object with the timestamp (in milliseconds)
    var date = new Date(timestamp * 1000);

    return date.getHours() + (date.getMinutes() + date.getSeconds()/60)/60;
}

function plotData(xAxis, stoveData, citizenData) {
    for (let i = 0; i < xAxis.length; i++) {
        xAxis[i] = convertTimestampOnCurrentDay(xAxis[i])
    }

    // Sample data with irregular x-coordinates
    let dataStove = [];

    for (let i = 0; i < xAxis.length; i++) {
        if (i != 0 && stoveData[i] != stoveData[i-1]) {
            dataStove.push({x: xAxis[i], y: stoveData[i-1] });
            dataStove.push({x: xAxis[i], y: stoveData[i] });
        } else {
            dataStove.push({x: xAxis[i], y: stoveData[i] });
        }
    }

    let dataCitizen = [];

    for (let i = 0; i < xAxis.length; i++) {
        if (i != 0 && citizenData[i] != citizenData[i-1]) {
            dataCitizen.push({x: xAxis[i], y: citizenData[i-1] });
            dataCitizen.push({x: xAxis[i], y: citizenData[i] });
        } else {
            dataCitizen.push({x: xAxis[i], y: citizenData[i] });
        }
    }

    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = (window.innerWidth*0.8) - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // Create scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([d3.min(dataStove, d => d.x), d3.max(dataStove, d => d.x)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataCitizen, d => d.y)])
        .range([height, 0]);

    // Create a line generator
    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    const area = d3.area()
        .x(d => xScale(d.x))
        .y0(height)
        .y1(d => yScale(d.y));

    d3.select("svg").remove();

    // Create SVG element
    const svg = d3.select('body')
        .select('.graphContainer')
        .append("svg")
        .classed("center", true) 
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Append gridlines to the chart
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)
            .ticks(10)
            .tickSize(-height)
            .tickFormat("")
        );

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale)
            .ticks(5)
            .tickSize(-width)
            .tickFormat("")
        );

    // Append x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Append y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Append the area to the SVG
    svg.append("path")
        .datum(dataCitizen)
        .attr("class", "area")
        .attr("fill", "rgba(0, 100, 0, 0.3)")
        .attr("d", area);

    // Append the line to the SVG
    svg.append('path')
        .datum(dataCitizen)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0, 150, 0, 1')
        .attr('stroke-width', 2)
        .attr('d', line);


    // Append the area to the SVG
    svg.append("path")
        .datum(dataStove)
        .attr("class", "area")
        .attr("fill", "rgba(0, 0, 100, 0.3)")
        .attr("d", area);

    // Append the line to the SVG
    svg.append('path')
        .datum(dataStove)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);

    // Append legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 200) + "," + 20 + ")");

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "rgba(0, 0, 100, 0.3)");

    legend.append("text")
        .attr("x", 25)
        .attr("y", 9)
        .attr("dy", ".35em")    
        .style("text-anchor", "start")
        .text("Stove-On (if > 0)");

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 20)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "rgba(0, 100, 0, 0.3)");

    legend.append("text")
        .attr("x", 25)
        .attr("y", 29)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text("Citizen in kitchen (if > 0)");
}

//! Denne skal rettes til
async function generateDataForGraph() {
    returnData = {
        xAxis: [],
        generatedStoveData: [],
        generatedCitizenData: []
    };

    data = await fetch(url)
        .then(response => {
            // Check if the response is successful (status code 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON response
            return response.json();
        }) 
    stoveOn = 0;
    citizenInKitchen = 0;
    notifyingCitizen = 0;

    data.forEach(entry => {
        if (entry.eventType == "OpenCare.EVODAY.Notifications.StoveTurnsOn") {
            stoveOn = 1;
            citizenInKitchen = 1;
        } else if (entry.eventType == "OpenCare.EVODAY.Notifications.StoveTurnsOff") {
            stoveOn = 0;
        } else if (entry.eventType == "OpenCare.EVODAY.Notifications.CitizenEnteredKitchen") {
            citizenInKitchen = 1;
        } else if (entry.eventType == "OpenCare.EVODAY.Notifications.CitizenLeftKitchen") {
            citizenInKitchen = 0;
        } else if (entry.eventType == "OpenCare.EVODAY.Notifications.SystemTurnsStoveOn") { // Ændr til det rigtige event
            stoveOn = 1;
        } else if (entry.eventType == "OpenCare.EVODAY.Notifications.SystemTurnsStoveOff") { // Ændr til det rigtige event
            stoveOn = 0;
        }

        returnData.xAxis.push(entry.timeStamp);
        returnData.generatedStoveData.push(1*stoveOn);
        returnData.generatedCitizenData.push(2*citizenInKitchen);
    })

    return returnData;
}

// Inits table
addRowsToTable();

// Updates every 1000 ms
setInterval(addRowsToTable, 1000);

function updateFrequency(generatedStoveData, xAxis) {
    let totalOnTime = 0;
    let freq = 0;
    for (i = 0; i < generatedStoveData.length-1; i++) {
        if (generatedStoveData[i] == 1) {
            totalOnTime += xAxis[i+1] - xAxis[i];
        }
    }
    freq = totalOnTime/(24*60*60) * 100;

    // Get the reference to the <p> element with id "freq"
    var freqElement = document.getElementById("freq");

    // round freq
    freq = parseFloat(freq.toFixed(2))

    // Modify its content
    freqElement.textContent = freq.toString() + "%";
}

function getDayOfTimestamp(timestamp) {
    // Create a new Date object with the timestamp (in milliseconds)
    var date = new Date(timestamp * 1000);

    var day = ('0' + date.getDate()).slice(-2);

    // Return the formatted date and time string
    return day;
}

function plotAndGenerateData() {
    generateDataForGraph()
        .then(
            plottableData => {
                lenOfData = 1;
                currDay = getDayOfTimestamp(plottableData.xAxis[plottableData.xAxis.length-1]);
                for (let i = plottableData.xAxis.length-2; i > -1; i--) {
                    if (getDayOfTimestamp(plottableData.xAxis[i]) == currDay) {
                        lenOfData++;
                        continue;
                    }
                    break;
                }

                plotData(
                    plottableData.xAxis.slice(-lenOfData), 
                    plottableData.generatedStoveData.slice(-lenOfData), 
                    plottableData.generatedCitizenData.slice(-lenOfData), 
                );
                updateFrequency(plottableData.generatedStoveData.slice(-lenOfData), plottableData.xAxis.slice(-lenOfData));
            }
        );

}



// Inits graph
plotAndGenerateData()

// Updates graph
setInterval(plotAndGenerateData, 1000);

// plottableData = generateDataForGraph();

