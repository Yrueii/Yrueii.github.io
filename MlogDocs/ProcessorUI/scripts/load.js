async function loadJSON(filePath){
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`JSON file not found at ${filePath}.`);
    const data = await response.json();
    return data;
}

function loadHTMLFromArray(parent, array, elementName = "div"){
    array.forEach(text => {
        const element = document.createElement(elementName);
        element.textContent = text;
        parent.appendChild(element);
    });
}

async function loadHTMLFromJSON(filePath, parentElementID, elementName = "div"){
    const parent = document.getElementById(parentElementID);
    loadJSON(filePath).then(JSONData => loadHTMLFromArray(parent, JSONData, elementName));
}

loadHTMLFromJSON("./data/payloads.json", "payloads");
loadHTMLFromJSON("./data/characters.json", "printCharMenu");


//requests should be an array of length-2 arrays,
//each with [fetchLocation, isJSON] where fetchLocation can be either file path or URL
async function fetchWithFallback(requests, fallbackValue = null){
    for (const request of requests) {
        const [fetchLocation, isJSON] = request;
        const response = await fetch(fetchLocation);
        if (response.ok){
            return isJSON ? response.json() : response.text();
        }
    }
    return fallbackValue;
}

//function to parse mimex format data
//properties = null to return all properties
function parseMimexData(data, properties = null, separator = ';', commentPrefixes = ["//", "#"]){
    const dataRows = data.split('\n');

    const parsedDataRows = [];

    let propertyIndexes = [];
    let foundFirstLine = false;

    for (const row of dataRows) {
        if (!row){
            continue;
        }
        if (commentPrefixes.some(prefix => row.startsWith(prefix))){
            continue;
        }

        const parsedRow = row.split(separator);

        // Check if first line
        if (!foundFirstLine){
            foundFirstLine = true;

            if (properties){
                // parse headers if properties are specified
                const propertyNamesToIndexes = {};
                parsedRow.forEach((propertyName, propertyIndex) => {
                    propertyNamesToIndexes[propertyName] = propertyIndex;
                });

                propertyIndexes = properties
                .map(propertyName => propertyNamesToIndexes[propertyName])
                .filter(index => index !== undefined);
            }
            continue;
        }

        if (!properties){
            parsedDataRows.push(parsedRow);
        } else {
            parsedDataRows.push(
                propertyIndexes
                .map(index => parsedRow[index])
                .filter(e => e !== undefined)
            );
        }
    }
    return parsedDataRows;
}


async function loadLAccessHTML (){
    const LAccessURL = "https://raw.githubusercontent.com/cardillan/mimex-data/main/data/be/mimex-laccess.txt";
    // const LAccessFilePath = "./data/LAccessFallback.txt";
    const LAccessRaw = await fetchWithFallback([
        [LAccessURL, 0], 
        //[LAccessFilePath, 0],
    ])

    const LAccessProperties = ["name", "sensor", "control", "setprop"];
    const LAccessParsed = parseMimexData(LAccessRaw, LAccessProperties);

    const LAccessNamePropertyIndex = LAccessProperties.indexOf("name");
    const propertyIsTrue = s => (
        ["true", "1"].includes(s)
        ? true
        : false
    );

    // sensor
    loadHTMLFromArray(
        document.getElementById("variables"),
        LAccessParsed
        .filter(e => propertyIsTrue(e[LAccessProperties.indexOf("sensor")]))
        .map(e => '@' + e[LAccessNamePropertyIndex])
    );

    // control
    loadHTMLFromArray(
        document.getElementById("controlMenu"),
        LAccessParsed
        .filter(e => propertyIsTrue(e[LAccessProperties.indexOf("control")]))
        .map(e => e[LAccessNamePropertyIndex])
    );

    // setprop
    loadHTMLFromArray(
        document.getElementById("setProp"),
        LAccessParsed
        .filter(e => propertyIsTrue(e[LAccessProperties.indexOf("setprop")]))
        .map(e => '@' + e[LAccessNamePropertyIndex])
    );
}

loadLAccessHTML();

