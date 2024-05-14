// Define the URL endpoint for the GET request
const url = 'http://' + window.location.host + '/getCollectedData/';

latestIndex = -1;

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
                    cell3.innerHTML = item.eventType;

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

function plotData(xAxis, stoveData, citizenData) {
    for (let i = 0; i < xAxis.length; i++) {
        xAxis[i] = convertTimestamp(xAxis[i])
    }

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xAxis,
            datasets: [
            {
                label: 'StoveOn',
                data: stoveData,
                fill: true,
                borderColor: 'rgb(0,0,0)',
                tension: 0.1,
                backgroundColor: 'rgba(0,0,0,0.2)',
                steppedLine: 'before',
            },
            {
                label: 'CitizenInKitchen',
                data: citizenData,
                fill: true,
                borderColor: 'rgb(0,100,0)',
                tension: 0.1,
                backgroundColor: 'rgba(0,100,0,0.2)',
                steppedLine: 'before',
            }
        ]
        },
        options: {
            animation: {
                duration: 0
            },
            scales: {
                xAxes: [{
                    gridLines: { color: "#131c2b" },
                    ticks: { fontColor: '#000000' } // Change x-axis label color to black
                }],
                yAxes: [{
                    display: true,
                    gridLines: { color: "#131c2b" },
                    ticks: {
                        fontColor: '#000000',
                        suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                        // OR //
                        beginAtZero: true,   // minimum value will be 0.
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: '#000000' // Change legend text color to black
                }
            }
        },  
    },
    );
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
    freq = totalOnTime/(xAxis[xAxis.length-1] - xAxis[0]) * 100;

    console.log(totalOnTime);
    console.log(xAxis[xAxis.length-1] - xAxis[0]);

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

// console.log(plottableData.xAxis);

