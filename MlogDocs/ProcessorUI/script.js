async function loadJSON(filePath){
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`JSON file not found at ${filePath}.`);
    const data = await response.json();
    return data;
}

function fillTemplateJSON(jsonData){
    const template = jsonData["template"];
    return jsonData["data"].map(e => template.replace(/\{\}/g, e));
}

loadJSON("./json/payloads.json").then(payloadData => {
    payloadHTML = fillTemplateJSON(payloadData);
    document.getElementById("payloads").innerHTML = payloadHTML.join("\n");
});

//####################################################################################################################################
// add instruction function
//####################################################################################################################################
const buttons = document.querySelectorAll('.addItems');
const buttonMap = new Map(
    Array.from(buttons, b => [b.textContent, b])
);
buttons.forEach(button => {
    button.addEventListener('click', () => addInstruction(button))
});
    
function addInstruction(button, update, field1, field2, field3, field4, field5, field6, field7, field8, field9, triggerPopupMenu){
    const pfstart = performance.now()
    
    if (typeof button === 'string') {
        button = buttonMap.get(button) || button;
    }
    buttonText = button?.textContent;
    divParent = button?.parentElement;
    type = divParent?.classList[0];
    // console.log('type')
    // console.log(type)
    closeWizard();
    
    let exclude = 0
    let tpmId = ''
    //Switch for every instruction type
    switch (buttonText) {
        case 'Read':
            code = `<span>read</span>
                    <span class="editable iNo" contenteditable="true">${field1 || 'result'}</span>
                    <span>=</span>
                    <span class="editable iNo" contenteditable="true">${field2 || 'cell1'}</span>
                    <span>at</span>
                    <span class="editable iNo" contenteditable="true">${field3 || '0'}</span>`
            break;
        case 'Write':
            code = `<span>write</span>
                    <span class="editable iNo" contenteditable="true">${field1 || 'result'}</span>
                    <span>=</span>
                    <span class="editable iNo" contenteditable="true">${field2 || 'cell1'}</span>
                    <span>at</span>
                    <span class="editable iNo" contenteditable="true">${field3 || '0'}</span>`
            break;
        case 'Draw':
            code = `<span class="editable iNo selectionValue" contenteditable="true" onclick="popUpMenu(event,'drawMenu')" oninput="selectOption(event,'drawMenu', null, null, 1)">${field1 || 'clear'}</span>
                    <span class="toggleableField" order="11" style="display:block;">r</span>
                    <span class="editable iNo toggleableField" order="1" contenteditable="true" style="display:block;">${field2 || '0'}</span>
                    <span class="toggleableField" order="22" style="display:block;">g</span>
                    <span class="editable iNo toggleableField" order="2" contenteditable="true" style="display:block;">${field3 || '0'}</span>
                    <span class="toggleableField" order="33" style="display:block;">b</span>
                    <span class="editable iNo toggleableField" order="3" contenteditable="true" style="display:block;">${field4 || '0'}</span>
                    <span class="toggleableField" order="44">a</span>
                    <span class="editable iNo toggleableField" order="4" contenteditable="true">${field5 || '0'}</span>
                    <span class="toggleableField" order="55">a</span>
                    <span class="editable iNo toggleableField" order="5" contenteditable="true">${field6 || '0'}</span>
                    <span class="toggleableField" order="66">a</span>
                    <span class="editable iNo toggleableField" order="6" contenteditable="true">${field7 || '0'}</span>`
            break;
        case 'Print':
            code = `<span class="editable iNo" id="string" contenteditable="true">${field1 || '\"frog\"'}</span>`
            break;
        case 'Print Char':
            code = `<span class="editable iNo" id="string" contenteditable="true">${field1 || '65'}</span>
                    <img src="image/pencil.png" alt="" onclick="popUpMenu(event,'printCharMenu')" class="pencilMenu">`
            break;
        case 'Format':
            code = `<span class="editable iNo" contenteditable="true">${field1 || '\"frog\"'}</span>`
            break;
        case 'Draw Flush':
            code = `<span>to</span>
                    <span class="editable blockControl" contenteditable="true">${field1 || 'display1'}</span>`
            break;
        case 'Print Flush':
            code = `<span>to</span>
                    <span class="editable blockControl" contenteditable="true">${field1 || 'message1'}</span>`
            break;
        case 'Get Link':
            code = `<span class="editable blockControl" contenteditable="true">${field1 || 'result'}</span>
                    <span>= link#</span>
                    <span class="editable blockControl" contenteditable="true">${field2 || '0'}</span>`
            break;
        case 'Control':
            code = `<span>set</span>
                    <span class="editable blockControl selectionValue" contenteditable="true" onclick="popUpMenu(event,'controlMenu')" oninput="selectOption(event,'controlMenu', null, null, 1)" order="1">${field1 || 'enabled'}</span>
                    <span>of</span>
                    <span class="editable blockControl" contenteditable="true" order="2">${field2 || 'block1'}</span>
                    <span class="toggleableField" id="field2" style="display:block;" order="33">to</span>
                    <span class="editable blockControl toggleableField" id="field2Value" contenteditable="true" style="display:block;" order="3">${field3 || '0'}</span>
                    <span class="toggleableField" id="field3" order="44"></span>
                    <span class="editable blockControl toggleableField" id="field3Value" contenteditable="true" order="4">${field4 || '0'}</span>
                    <span class="toggleableField" id="field4" order="55"></span>
                    <span class="editable blockControl toggleableField" id="field4Value" contenteditable="true" order="5">${field5 || '0'}</span>`
            break;
        case 'Radar':
            code = `<span>from</span>
                    <span class="editable blockControl" contenteditable="true" order="5">${field5 || 'turret1'}</span>
                    <span>target</span>
                    <span class="editable blockControl" contenteditable="true" order="1" onclick="popUpMenu(event,'radarMenuTarget')" oninput="selectOption(event,'radarMenuTarget', null, null, 1)">${field1 || 'enemy'}</span>
                    <span>and</span>
                    <span class="editable blockControl" contenteditable="true" order="2" onclick="popUpMenu(event,'radarMenuTarget')" oninput="selectOption(event,'radarMenuTarget', null, null, 1)">${field2 || 'any'}</span>
                    <span>and</span>
                    <span class="editable blockControl" contenteditable="true" order="3" onclick="popUpMenu(event,'radarMenuTarget')" oninput="selectOption(event,'radarMenuTarget', null, null, 1)">${field3 || 'any'}</span>
                    <span>order</span>
                    <span class="editable blockControl" contenteditable="true" order="6">${field6 || '1'}</span>
                    <span>sort</span>
                    <span class="editable blockControl" contenteditable="true" order="4" onclick="popUpMenu(event,'radarMenuSort')" oninput="selectOption(event,'radarMenuSort', null, null, 1)">${field4 || 'distance'}</span>
                    <span>output</span>
                    <span class="editable blockControl" contenteditable="true" order="7">${field7 || 'result'}</span>`
            break;
        case 'Sensor':
            code = `<span class="editable blockControl" contenteditable="true" id="field1Value">${field1 || 'result'}</span>
                    <span>=</span>
                    <span class="editable blockControl dontInclude" contenteditable="true" id="field2Value" oninput="selectOption(event,'sensorMenu', null, null, 1)">${field3 || '@copper'}</span>
                    <img src="image/pencil.png" alt="" onclick="popUpMenu(event,'sensorMenu','sensor')" class="pencilMenu">
                    <span>in</span>
                    <span class="editable blockControl" contenteditable="true" id="field3Value">${field2 || 'block1'}</span>`
            break;
        case 'Set':
            code = `<span class="editable operation" contenteditable="true">${field1 || 'result'}</span>
                    <span>=</span>
                    <span class="editable operation" contenteditable="true">${field2 || 'a'}</span>`
            break;
        case 'Operation':
            code = `<span class="editable operation" contenteditable="true" order="1">${field2 || 'result'}</span>
                    <span>=</span>
                    <span class="editable operation" contenteditable="true" order="3">${field3 || 'a'}</span>
                    <span class="editable operation" id="operation" order="2" contenteditable="true" onclick="popUpMenu(event,'opMenu')" oninput="selectOption(event,'opSuggestion', null, null, 1)">${field1 || '*'}</span>
                    <span class="editable operation" contenteditable="true" order="4">${field4 || 'b'}</span>`
            break;
        case 'Lookup':
            code = `<span class="editable operation" contenteditable="true" id="field1Value">${field2 || 'result'}</span>
                    <span>=</span>
                    <span>lookup</span>
                    <span class="editable operation" contenteditable="true" id="field2Value" onclick="popUpMenu(event,'lookupMenu')" oninput="selectOption(event,'lookupMenu', null, null, 1)">${field1 || 'item'}</span>
                    <span>#</span>
                    <span class="editable operation" contenteditable="true" id="field3Value">${field3 || '0'}</span>`
            break;
        case 'Pack Color':
            code = `<span class="editable operation" contenteditable="true">${field1 || 'result'}</span>
                    <span>=</span>
                    <span>pack</span>
                    <span class="editable operation" contenteditable="true">${field2 || '1'}</span>
                    <span class="editable operation" contenteditable="true">${field3 || '0'}</span>
                    <span class="editable operation" contenteditable="true">${field4 || '0'}</span>
                    <span class="editable operation" contenteditable="true">${field5 || '1'}</span>`
            break;
        case 'Wait':
            code = `<span class="editable flowControl" contenteditable="true">${field1 || 'result'}</span>
                    <span>sec</span>`
            break;
        case 'Stop':
            code = ``
            break;
        case 'End':
            code = ``
            break;
        case 'Jump':
            code = `<span>if</span>
                    <span class="editable flowControl toggleableField" contenteditable="true" style="display:block;" order="3">${field3 || 'x'}</span>
                    <span class="editable flowControl selectionValue" id="operation" contenteditable="true" onclick="popUpMenu(event,'jumpMenu')" oninput="selectOption(event,'jumpMenu', null, null, 1)" order="2">${field2 || 'not'}</span>
                    <span class="editable flowControl toggleableField" contenteditable="true" style="display:block;" order="4">${field4 || 'false'}</span>
                    <div class="jumpTo">
                        <span>Jump To</span>
                        <span class="editable flowControl" id="field1Value" contenteditable="true" draggable="false" onclick="jumpDestination(event)" order="1">${field1 || '-1'}</span>
                    </div>
                    <canvas class="jumpArrow" width=60></canvas>
                    <img src="image/logic-node.png" alt="" class="jumpArrowTriangle" draggable="false">`
            break;
        case 'Unit Bind':
            code = `<span>type</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'ubindMenu')" oninput="selectOption(event,'ubindMenu', null, null, 1)">${field1 || '@poly'}</span>`
            break;
        case 'Unit Control':
            code = `<span class="editable unitControl selectionValue" contenteditable="true" onclick="popUpMenu(event,'ucontrolMenu')" oninput="selectOption(event,'ucontrolMenu', null, null, 1)">${field1 || 'move'}</span>
                    <span class="toggleableField" id="field1" style="display:block;">x</span>
                    <span class="editable unitControl toggleableField" id="field1Value" contenteditable="true" style="display:block;">${field2 || '0'}</span>
                    <span class="toggleableField" id="field2" style="display:block;">y</span>
                    <span class="editable unitControl toggleableField" id="field2Value" contenteditable="true" style="display:block;">${field3 || '0'}</span>
                    <span class="toggleableField" id="field3">x</span>
                    <span class="editable unitControl toggleableField" id="field3Value" contenteditable="true">${field4 || '0'}</span>
                    <span class="toggleableField" id="field4">y</span>
                    <span class="editable unitControl toggleableField" id="field4Value" contenteditable="true">${field5 || '0'}</span>
                    <span class="toggleableField" id="field5">y</span>
                    <span class="editable unitControl toggleableField" id="field5Value" contenteditable="true">${field6 || '0'}</span>`
            break;
        case 'Unit Radar':
            code = `<span>target</span>
                    <span class="editable unitControl" contenteditable="true" id="field2Value" onclick="popUpMenu(event,'radarMenuTarget')" oninput="selectOption(event,'radarMenuTarget', null, null, 1)">${field1 || 'enemy'}</span>
                    <span>and</span>
                    <span class="editable unitControl" contenteditable="true" id="field3Value" onclick="popUpMenu(event,'radarMenuTarget')" oninput="selectOption(event,'radarMenuTarget', null, null, 1)">${field2 || 'any'}</span>
                    <span>and</span>
                    <span class="editable unitControl" contenteditable="true" id="field4Value" onclick="popUpMenu(event,'radarMenuTarget')" oninput="selectOption(event,'radarMenuTarget', null, null, 1)">${field3 || 'any'}</span>
                    <span>order</span>
                    <span class="editable unitControl" contenteditable="true" id="field5Value">${field6 || '1'}</span>
                    <span>sort</span>
                    <span class="editable unitControl" contenteditable="true" id="field6Value" onclick="popUpMenu(event,'radarMenuSort')" oninput="selectOption(event,'radarMenuSort', null, null, 1)">${field4 || 'distance'}</span>
                    <span>output</span>
                    <span class="editable unitControl" contenteditable="true" id="field7Value">${field7 || 'result'}</span>`
            break;
        case 'Unit Locate':
            code = `<span>find</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'ulocateFindMenu')" oninput="selectOption(event,'ulocateFindMenu', null, null, 1)">${field1 || 'building'}</span>
                    <span class="toggleableField" id="field1" order="11" style="display:block;">group</span>
                    <span class="editable unitControl toggleableField" contenteditable="true" id="field1Value" order="1" style="display:block;" onclick="popUpMenu(event,'ulocateGroupMenu')" oninput="selectOption(event,'ulocateGroupMenu', null, null, 1)">${field2 || 'core'}</span>
                    <span class="toggleableField" id="field2" order="22" style="display:block;">enemy</span>
                    <span class="editable unitControl toggleableField" contenteditable="true" id="field2Value" order="2" style="display:block;">${field3 || 'true'}</span>
                    <span class="toggleableField" id="field3" order="33">ore</span>
                    <span class="editable unitControl toggleableField" id="field3Value" order="3" contenteditable="true" oninput="selectOption(event,'sensorMenu', null, null, 1)">${field4 || '@copper'}</span>
                    <img src="image/pencil.png" alt="" id="field3" order="33" onclick="popUpMenu(event,'sensorMenu','sensor')" class="pencilMenu toggleableField">
                    <span>outX</span>
                    <span class="editable unitControl" contenteditable="true">${field5 || 'outx'}</span>
                    <span>outY</span>
                    <span class="editable unitControl" contenteditable="true">${field6 || 'outy'}</span>
                    <span>found</span>
                    <span class="editable unitControl" contenteditable="true">${field7 || 'found'}</span>
                    <span>building</span>
                    <span class="editable unitControl" contenteditable="true">${field8 || 'building'}</span>`
            break;
        case 'Noop':
            code = `<span>No Operation</span>`
            break;
        // idk, i haven't thought about how would i do label yet, but probably not like this
        // so im not gonna continue implementing it
        // i implemented it anyway
        case 'Label':
            code = `<span class="editable extra" contenteditable="true" id="field1">${field1 || 'Label'}</span>`
            exclude = 1
            type = 'Label-container extra'
            break;
        case 'Comment':
            code = `<span class="editable extra" contenteditable="true" id="field1">${field1 || 'Comment'}</span>`
            type = 'Comment-container extra'
            exclude = 1
            break;
        case 'Get Block':
            code = `<span class="editable world" contenteditable="true" order="2">${field2 || 'result'}</span>
                    <span>=</span>
                    <span>get</span>
                    <span class="editable world" contenteditable="true" order="1" onclick="popUpMenu(event,'ulocateFindMenu')" oninput="selectOption(event,'ulocateFindMenu', null, null, 1)">${field1 || 'building'}</span>
                    <span>at</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '0'}</span>
                    <span>,</span>
                    <span class="editable world" contenteditable="true" order="4">${field4 || '0'}</span>`
            break;
        case 'Set Block':
            code = `<span>set</span>
                    <span class="editable world selectionValue" contenteditable="true" order="1" onclick="popUpMenu(event,'setBlockMenu')" oninput="selectOption(event,'setBlockMenu', null, null, 1)">${field1 || 'floor'}</span>
                    <span>at</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '0'}</span>
                    <span>,</span>
                    <span class="editable world" contenteditable="true" order="4">${field4 || '0'}</span>
                    <span>to</span>
                    <span class="editable world" contenteditable="true" order="2">${field2 || '@air'}</span>
                    <span class="toggleableField" order="5">team</span>
                    <span class="editable world toggleableField" contenteditable="true" order="5">${field5 || '@derelic'}</span>
                    <span class="toggleableField" order="6">rot</span>
                    <span class="editable world toggleableField" contenteditable="true" order="6">${field6 || '0'}</span>`
            tpmId = "setBlockMenu"
            break;
        case 'Spawn Unit':
            code = `<span class="editable world" contenteditable="true" order="6">${field6 || 'result'}</span>
                    <span>=</span>
                    <span>spawn</span>
                    <span class="editable world" contenteditable="true" order="1">${field1 || '@dagger'}</span>
                    <span>at</span>
                    <span class="editable world" contenteditable="true" order="2">${field2 || '10'}</span>
                    <span>,</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '10'}</span>
                    <span>team</span>
                    <span class="editable world" contenteditable="true" order="5">${field5 || '@sharded'}</span>
                    <span>rot</span>
                    <span class="editable world" contenteditable="true" order="4">${field4 || '90'}</span>`
            break;
        case 'Apply Status':
            field1 = field1 === 'true' ? 'clear' : (field1 === 'false' ? 'apply' : field1);
            code = `<span class="editable world dontInclude" order="1" switch='["apply", "clear"]' onclick="valueToggle(event)">${field1 || 'apply'}</span>
                    <span class="editable world" contenteditable="true" order="2" onclick="popUpMenu(event,'applyStatusMenu')" oninput="selectOption(event,'applyStatusMenu', null, null, 1)">${field2 || 'wet'}</span>
                    <span class="toggleableField" order="33">to</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || 'unit'}</span>
                    <span class="toggleableField" style="display:block;" order="4">for</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="4">${field4 || '10'}</span>`
            break;
        case 'Weather Sense':
            code = `<span class="editable world" contenteditable="true" order="1" >${field1 || 'result'}</span>
                    <span>=</span>
                    <span class="editable world" contenteditable="true" order="2" oninput="selectOption(event,'weatherMenu', null, null, 1)">${field2 || '@rain'}</span>
                    <img src="image/pencil.png" alt="" onclick="popUpMenu(event,'weatherMenu')" class="weatherMenu">`
                    
            break;
        case 'Weather Set':
            code = `<span>set weather</span>
                    <span class="editable world" contenteditable="true" order="1" oninput="selectOption(event,'weatherMenu', null, null, 1)">${field1 || '@rain'}</span>
                    <img src="image/pencil.png" alt="" onclick="popUpMenu(event,'weatherMenu')" class="weatherMenu">
                    <span>state</span>
                    <span class="editable world" contenteditable="true" order="2">${field2 || 'true'}</span>`
            break;
        case 'Spawn Wave':
            code = `<span>natural</span>
                    <span class="editable world" contenteditable="true" order="2" >${field2 || 'false'}</span>
                    <span>x</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '10'}</span>
                    <span>y</span>
                    <span class="editable world" contenteditable="true" order="1">${field1 || '10'}</span>`
                    
            break;
        case 'Set Rule':
            code = `<span class="editable world selectionValue" contenteditable="true" onclick="popUpMenu(event,'setRuleMenu')" oninput="selectOption(event,'setRuleMenu', null, null, 1)" order="1">${field1 || 'waveSpacing'}</span>
                    <span class="toggleableField" style="display:block;" order="11">=</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="2">${field2 || '10'}</span>
                    <span class="toggleableField" order="3">x</span>
                    <span class="editable world toggleableField" contenteditable="true" order="3">${field3 || '0'}</span>
                    <span class="toggleableField" order="4">y</span>
                    <span class="editable world toggleableField" contenteditable="true" order="4">${field4 || '0'}</span>
                    <span class="toggleableField" order="5">w</span>
                    <span class="editable world toggleableField" contenteditable="true" order="5">${field5 || '100'}</span>
                    <span class="toggleableField" order="6">h</span>
                    <span class="editable world toggleableField" contenteditable="true" order="6">${field6 || '100'}</span>`
            tpmId = "setRuleMenu"
            break;
        case 'Flush Message':
            code = `<span class="editable world selectionValue" contenteditable="true" onclick="popUpMenu(event,'flushMessageMenu')" oninput="selectOption(event,'flushMessageMenu', null, null, 1)" order="1">${field1 || 'announce'}</span>
                    <span class="toggleableField" style="display:block;" order="2">for</span>
                    <span class="editable world toggleableField"style="display:block;" contenteditable="true" order="2">${field2 || '3'}</span>
                    <span class="toggleableField" style="display:block;"order="2">sec</span>
                    <span>success</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '@wait'}</span>`
            tpmId = "flushMessageMenu"
            break;
        case 'Cutscene':
            code = `<span class="editable world selectionValue" contenteditable="true" onclick="popUpMenu(event,'cutsceneMenu')" oninput="selectOption(event,'cutsceneMenu', null, null, 1)" order="1">${field1 || 'pan'}</span>
                    <span class="toggleableField" style="display:block;" order="22">x</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="2">${field2 || '100'}</span>
                    <span class="toggleableField" style="display:block;" order="3">y</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="3">${field3 || '100'}</span>
                    <span class="toggleableField" style="display:block;" order="4">speed</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="4">${field4 || '0.06'}</span>`
            tpmId = "cutsceneMenu"
            break;
        case 'Effect':
            code = `<span class="editable world selectionValue" contenteditable="true" onclick="popUpMenu(event,'effectMenu')" oninput="selectOption(event,'effectMenu', null, null, 1)" order="1">${field1 || 'warn'}</span>
                    <span class="toggleableField" style="display:block;" order="2">x</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="2">${field2 || '0'}</span>
                    <span class="toggleableField" style="display:block;" order="3">y</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="3">${field3 || '0'}</span>
                    <span class="toggleableField" order="44">data</span>
                    <span class="editable world toggleableField" contenteditable="true" order="4">${field4 || '2'}</span>
                    <span class="toggleableField" order="55">data</span>
                    <span class="editable world toggleableField" contenteditable="true" order="5">${field5 || '%ffaaff'}</span>`
            tpmId = "effectMenu"
            break;
        case 'Explosion':
            code = `<span>team</span>
                    <span class="editable world" contenteditable="true" order="1">${field1 || '@crux'}</span>
                    <span>x</span>
                    <span class="editable world" contenteditable="true" order="2">${field2 || '0'}</span>
                    <span>y</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '0'}</span>
                    <span>radius</span>
                    <span class="editable world" contenteditable="true" order="4">${field4 || '5'}</span>
                    <span>damaged</span>
                    <span class="editable world" contenteditable="true" order="5">${field5 || '50'}</span>
                    <span>air</span>
                    <span class="editable world" contenteditable="true" order="6">${field6 || 'true'}</span>
                    <span>ground</span>
                    <span class="editable world" contenteditable="true" order="7">${field7 || 'true'}</span>
                    <span>pirece</span>
                    <span class="editable world" contenteditable="true" order="8">${field8 || 'false'}</span>
                    <span>effect</span>
                    <span class="editable world" contenteditable="true" order="9">${field9 || 'true'}</span>`
            break;
        case 'Set Rate':
            code = `<span>ipt</span>
                    <span>=</span>
                    <span class="editable world" contenteditable="true" order="1">${field1 || '10'}</span>`
            break;
        case 'Fetch':
            code = `<span class="editable world" style="display:block;" contenteditable="true" order="2">${field2 || 'result'}</span>
                    <span>=</span>
                    <span class="editable world selectionValue" contenteditable="true" onclick="popUpMenu(event,'fetchMenu')" oninput="selectOption(event,'fetchMenu', null, null, 1)" order="1">${field1 || 'unit'}</span>
                    <span>team</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '@sharded'}</span>
                    <span class="toggleableField" style="display:block;" order="44">#</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="4">${field4 || '0'}</span>
                    <span class="toggleableField" style="display:block;" order="55">unit</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="5">${field5 || '@conveyor'}</span>`
            tpmId = "fetchMenu"
            break;
        case 'Sync':
            code = `<span class="editable world" contenteditable="true" order="1">${field1 || 'var'}</span>`
            break;
        case 'Get Flag':
            code = `<span class="editable world" contenteditable="true" order="1">${field1 || 'result'}</span>
                    <span>=</span>
                    <span>flag</span>
                    <span class="editable world" contenteditable="true" order="2">${field2 || '"flag"'}</span>`
            break;
        case 'Set Flag':
            code = `<span class="editable world" contenteditable="true" order="2">${field2 || '"flag"'}</span>
                    <span>=</span>
                    <span class="editable world" contenteditable="true" order="1">${field1 || 'true'}</span>`
            break;
        case 'Set Prop':
            code = `<span>set</span>
                    <span class="editable world" contenteditable="true" order="1" oninput="selectOption(event,'sensorMenu', null, null, 1, 'prop')">${field1 || '@copper'}</span>
                    <img src="image/pencil.png" alt="" onclick="popUpMenu(event,'sensorMenu','prop')" class="pencilMenu">
                    <span>of</span>
                    <span class="editable world" contenteditable="true" order="2">${field2 || 'block1'}</span>
                    <span>to</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '0'}</span>`
            break;
        case 'Play Sound':
            field1 = field1 === 'true' ? 'clear' : (field1 === 'false' ? 'apply' : field1);
            code = `<span class="editable world dontInclude" switch='["global", "positional"]' onclick="valueToggle(event)">${field1 || 'global'}</span>
                    <span class="editable world" contenteditable="true" oninput="selectOption(event,'soundMenu', null, null, 1)">${field2 || '@sfx-pew'}</span>
                    <img src="image/pencil.png" alt="" onclick="popUpMenu(event,'soundMenu')" class="pencilMenu">
                    <span>volume</span>
                    <span class="editable world" contenteditable="true">${field3 || '1'}</span>
                    <span>pitch</span>
                    <span class="editable world" contenteditable="true">${field4 || '1'}</span>
                    <span class="toggleableField" style="display:block;" order="11">pan</span>
                    <span class="editable world toggleableField" style="display:block;" contenteditable="true" order="1">${field5 || '0'}</span>
                    <span class="toggleableField" order="22">x</span>
                    <span class="editable world toggleableField" contenteditable="true" order="2">${field6 || '@thisx'}</span>
                    <span class="toggleableField" order="33">y</span>
                    <span class="editable world toggleableField" contenteditable="true" order="3">${field7 || '@thisy'}</span>
                    <span>limit</span>
                    <span class="editable world" contenteditable="true">${field8 || 'true'}</span>
                    `
            break;
        case 'Set Marker':
            code = `<span>set</span>
                    <span class="editable world selectionValue" contenteditable="true" onclick="popUpMenu(event,'setMarkerMenu')" oninput="selectOption(event,'setMarkerMenu', null, null, 1)" order="1">${field1 || 'pos'}</span>
                    <span class="toggleableField" style="display:block" order="22">of id#</span>
                    <span class="editable world toggleableField" style="display:block" contenteditable="true" order="2">${field2 || '0'}</span>
                    <span class="toggleableField" style="display:block" order="33">x</span>
                    <span class="editable world toggleableField" style="display:block" contenteditable="true" order="3">${field3 || '0'}</span>
                    <span class="toggleableField" style="display:block" order="44">y</span>
                    <span class="editable world toggleableField" style="display:block" contenteditable="true" order="4">${field4 || '0'}</span>
                    <span class="toggleableField" order="55"></span>
                    <span class="editable world toggleableField" contenteditable="true" order="5">${field5 || '0'}</span>
                    `
            break;
        case 'Make Marker':
            code = `<span class="editable world selectionValue" contenteditable="true" onclick="popUpMenu(event,'makeMarkerMenu')" oninput="selectOption(event,'makeMarkerMenu', null, null, 1)" order="1">${field1 || 'shape'}</span>
                    <span>id</span>
                    <span class="editable world" contenteditable="true" order="2">${field2 || '0'}</span>
                    <span>x</span>
                    <span class="editable world" contenteditable="true" order="3">${field3 || '0'}</span>
                    <span>y</span>
                    <span class="editable world" contenteditable="true" order="4">${field4 || '0'}</span>
                    <span>replace</span>
                    <span class="editable world" contenteditable="true" order="5">${field5 || 'true'}</span>
                    `
            break;
        case 'Locale Print':
            code = `<span class="editable world" contenteditable="true" order="1">${field1 || '"name"'}</span>`
            break;
        default:
            code = `<span>if you see this that means something went 
                    wrong, refresh or contact me</span>`
    }

    let lastContainer
    savedSettings = getSavedSettings();
    if (!cursorContainer || update == 0 || !savedSettings.addBelowCursor){
        if (document.querySelector('.container')){
            containers = document.querySelectorAll('.container')
        }else {
            containers = document.querySelectorAll('.placeHolder')
        }
        lastContainer = containers[containers.length - 1];
    }else {
        lastContainer = cursorContainer
    }
    
    lastContainer.insertAdjacentHTML('afterend', `
        <div class="container" ${exclude === 1 ? 'id=\"exclude\"' : ''}>
            <div class="innerContainer ${type}-container">
                <div class="block-header">
                    <span class="headerText">${buttonText}</span>
                    <div class="controls">
                        ${exclude === 1 ? '' : '<span id="lineNumber"></span>'}
                        <img src="image/copy.png" alt="" onclick="copy(event)" class="copyButton">
                        <span class="close" onclick="Delete(event)">&times;</span>
                    </div>
                </div>
                <div class="block-content">
                    <div class="code">
                        ${code}
                    </div>
                </div>
            </div>
        </div>`
    );

    newElement = lastContainer.nextElementSibling 

    if (triggerPopupMenu) {      
        // const onclickSpan = newElement.querySelectorAll('[onclick]')[2]
        // onclickValue = (onclickSpan.getAttribute('onclick'));
        // let args = onclickValue.match(/\((?:\d+,\s*)?'([^']*)'/);
        // console.log(args); 
                                    // probably shouldn't use ('[onclick]')[2]
        selectOption(null,tpmId,(newElement.querySelectorAll('[onclick]')[2]),newElement.querySelector('.selectionValue').textContent)
    }
    if (update == 0){
        return
    } else {
        updateLineNumber();
    }
    console.log(`${performance.now() - pfstart}`);

    };

//count and update line number on instruction

function updateLineNumber() {
    let jumpIns = [];
    containers = document.querySelectorAll('.container:not(#exclude)'); //can use :has() but i heard its not supported in older browser
    containers.forEach((containerr, index) => {
        const lineNumberElement = containerr.querySelector('#lineNumber');
        if (lineNumberElement) {
            lineNumberElement.textContent = index;
        }
        if (!containerr.hasDown){
            MouseDown(containerr.querySelector('.block-header'),containerr)
        }
        if (!containerr.hasDownJump && containerr.querySelector('.jumpTo')){
            MouseDown(containerr.querySelector('.jumpArrowTriangle'),containerr)
        }
        if ((containerr.querySelector('.headerText')).textContent == 'Jump'){
            jumpIns.push(containerr)
        }
    });

    labels = document.querySelectorAll('.container#exclude') //i know this is a shitty fix
    labels.forEach(label => {
        if(!label.hasDown){
            MouseDown(label.querySelector('.block-header'),label)
        }
    })
    updateJumpArrow(jumpIns)
    // console.log(jumpIns);
}

function updateJumpArrow(jumpIns) {
    jumpIns.forEach(jump => {
        const canvas = jump.querySelector('.jumpArrow');
        // console.log(canvas);

        const ctx = canvas.getContext('2d');
        const containerrRect = (jump.closest('.container')).getBoundingClientRect();
        const destinations = document.querySelectorAll('#lineNumber');

        let destinationTarget = destinations[parseInt(jump.querySelector('#field1Value').textContent)]?.closest('.container')
        if (!destinationTarget){
            labels = document.querySelectorAll('.container#exclude')
            if (labels){
                labels.forEach(label => {
                    if (label.querySelector('#field1').textContent == jump.querySelector('#field1Value').textContent){
                        destinationTarget = label
                    }
                })
            }
        }

        const desRect = destinationTarget?.getBoundingClientRect(); 
        let distance = (containerrRect.top + containerrRect.height / 2) - (desRect?.top + desRect?.height / 2)
        if (distance > 0){
            canvas.style.bottom = `10%`
            canvas.style.top = ''
        }else {
            canvas.style.top = `10%`
            canvas.style.bottom = ''
        }
        canvas.style.left = ''
        distance = Math.abs(distance)
        canvas.height = distance+20
        canvas.width = 100

        // im so lazy so optimize this, point is it works
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        if (canvas.style.bottom === ''){
            ctx.beginPath()
            ctx.moveTo(10, distance+10)
            ctx.bezierCurveTo(100, distance/0.95, 100, distance/1024, 0, 10)
            ctx.stroke()
            ctx.closePath()
            ctx.beginPath()
            const bottom = distance+20
            ctx.moveTo(15,bottom - 5)
            ctx.lineTo(15,bottom - 15)
            ctx.lineTo(5,bottom - 10)
            ctx.closePath()
            ctx.fillStyle = 'white';
            ctx.fill()
            ctx.stroke();
        } else {
            ctx.beginPath()
            ctx.moveTo(0, distance + 10)
            ctx.bezierCurveTo(100, distance/1.05, 100, distance/1024, 10, 10)
            ctx.stroke()
            ctx.closePath()
            ctx.beginPath()
            ctx.moveTo(15,5)
            ctx.lineTo(15,15)
            ctx.lineTo(5,10)
            ctx.closePath()
            ctx.fillStyle = 'white';
            ctx.fill()
            ctx.stroke();
        }
    // ctx.quadraticCurveTo(100, distance/2, 0, 0);
    })
}

//##############
// search bar for add instruction
//##############

const addSearchBar = document.getElementById("addSearchBar")

addSearchBar.addEventListener("input",() => {
    refreshAddSearch()
})

function refreshAddSearch () {
    const query = addSearchBar.value.toLowerCase();
    wizardTitle = document.querySelectorAll('.wizard-title')
    if (query === ''){
        wizardTitle.forEach(title => {
            title.style.display = ""
        })
        buttons.forEach(button => {
            button.style.display = ""
        })
    } else {
        wizardTitle.forEach(title => {
            title.style.display = "none"
        })
        buttons.forEach(button => {
            const text = button.textContent.toLowerCase();
            if (text.includes(query)){
                button.style.display = ""
                button.parentElement.previousElementSibling.style.display = ""
            }else { 
                button.style.display = "none"
            }
        })
    }
}

addSearchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const firstButton = Array.from(buttons).find(button => button.style.display !== 'none');
        if (firstButton){
            addInstruction(firstButton)
        }
    }
});
    
//####################################################################################################################################
// instructions controls function
//####################################################################################################################################
function Delete(e) {
    const parentContainer = e.target.closest('.container');
    if (parentContainer) {
        parentContainer.remove();
    }
    updateLineNumber();
}

function copy(e) {

    const parentContainer = e.target.closest('.container');
    if (parentContainer) {
        const copyCode = parentContainer.outerHTML; 
        parentContainer.insertAdjacentHTML('afterend', copyCode)
    }
    updateLineNumber();
}

//####################################################################################################################################
// wizard function 
//####################################################################################################################################
function closeWizard(fromFrontend,e) {
    if (fromFrontend){
        if (e.target.classList.contains('menu')) {
            document.getElementById('wizardMenu').style.display = 'none';
        }
    }else {
        document.getElementById('wizardMenu').style.display = 'none';
    }
}

function openWizard() {
    document.getElementById('wizardMenu').style.display = 'flex';
}
//#######

function openHelpWizard() {
    document.getElementById('helpMenu').style.display = 'flex';
}

function closeHelpWizard() {
    document.getElementById('helpMenu').style.display = 'none';
}
//#######

function openSaveMenu(){
    document.getElementById('saveMenu').style.display = 'flex';
    refreshSaves();
}

function closeSaveMenu(fromFrontend,e){
    if (fromFrontend){
        if (e.target.classList.contains('menu')) {
            document.getElementById('saveMenu').style.display = 'none';
        }
    }else {
        document.getElementById('saveMenu').style.display = 'none';
    }
}
//#######

function openPasteMenu(){
    document.getElementById('pasteMenu').style.display = 'flex';
}

function closePasteMenu(fromFrontend,e){
    if (fromFrontend){
        if (e.target.classList.contains('menu')) {
            document.getElementById('pasteMenu').style.display = 'none';
        }
        }else {
            document.getElementById('pasteMenu').style.display = 'none';
        }
}
//#######

function openNameMenu(){
    document.getElementById('name').style.display = 'flex';
}

function closeNameMenu(fromFrontend,e){
    if (e){
        e.stopPropagation()
    }
    if (fromFrontend){
        if (e.target.classList.contains('menu')) {
            document.getElementById('name').style.display = 'none';
        }
        }else {
            document.getElementById('name').style.display = 'none';
        }
}
//#######
function openTimelineMenu(){
    document.getElementById('timeline').style.display = 'flex';
    refreshTimeline()
}

function closeTimelineMenu(fromFrontend,e){
    if (e){
        e.stopPropagation()
    }
    if (fromFrontend){
        if (e.target.classList.contains('menu')) {
            document.getElementById('timeline').style.display = 'none';
        }
        }else {
            document.getElementById('timeline').style.display = 'none';
        }
}
//#######

function openSettingMenu(){
    document.getElementById('setting').style.display = 'flex';
    refreshSettingMenu()
}

function closeSettingMenu(fromFrontend,e){
    if (e){
        e.stopPropagation()
    }
    if (fromFrontend){
        if (e.target.classList.contains('menu')) {
            document.getElementById('setting').style.display = 'none';
        }
        }else {
            document.getElementById('setting').style.display = 'none';
        }
}
//#######
function toggleTooltip(element) {
    element.classList.toggle("active");
}


//####################################################################################################################################
// Keybinds
//####################################################################################################################################
keybindMap = {
    '1': 'Read',
    '2': 'Write',
    '3': 'Draw',
    '4': 'Print',
    '5': 'Format',
    'q': 'Draw Flush',
    'w': 'Print Flush',
    'e': 'Get Link',
    'r': 'Control',
    't': 'Radar',
    'y': 'Sensor',
    'a': 'Set',
    's': 'Operation',
    'd': 'Lookup',
    'f': 'Pack Color',
    'z': 'Wait',
    'x': 'Stop',
    'c': 'End',
    'v': 'Jump',
    'u': 'Unit Bind',
    'i': 'Unit Control',
    'o': 'Unit Radar',
    'p': 'Unit Locate',
}
// let ctrlDown;
document.addEventListener('keydown',(e) =>{
    const wizardMenu = document.getElementById('wizardMenu');
    const helpMenu = document.getElementById('helpMenu');
    const saveMenu = document.getElementById('saveMenu');
    const pasteMenu = document.getElementById('pasteMenu');
    const input = document.getElementById('addSearchBar');
    const isVisibleAdd = wizardMenu.style.display === 'flex'
    const isVisibleHelp = helpMenu.style.display === 'flex'
    const isVisibleSave = saveMenu.style.display === 'flex';
    const isVisiblePaste = pasteMenu.style.display === 'flex';
    // if (e.key === 'Control'){
    //     ctrlDown = true;
    // }
    if ((e.key === 'Escape' && (isVisibleAdd || isVisibleHelp || isVisibleSave)) || (isVisibleAdd && e.key === 'F2')) {
        closeWizard();
        closeHelpWizard();
        closeSaveMenu();
        closePasteMenu();
        closeTimelineMenu();
        // console.log('work');
    }else if (e.key === 'F2' && (!isVisibleAdd && !isVisibleHelp && !isVisibleSave)) {
        document.activeElement.blur();
        // console.log('work1');
        openWizard();
        addSearchBar.value = '';
        savedSettings = getSavedSettings();
        console.log(savedSettings.F2SearchAdd);
        if (savedSettings.F2SearchAdd){
            addSearchBar.focus();
        }
        refreshAddSearch();
    }else if (isVisibleAdd) {
        if (keybindMap[e.key] && document.activeElement != input){
            addInstruction(keybindMap[e.key])
        }
        if (e.key === 'Tab'){
            e.preventDefault();
            addSearchBar.focus();
        }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault
        document.activeElement.blur();
    }
    if (!isVisibleAdd && !isVisibleHelp && !isVisibleSave && !isVisiblePaste){
        if (e.ctrlKey && e.altKey && e.key === 's'){
            EnableCursor();
        }else if (cursorContainer){
            if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.altKey){
                e.preventDefault();
                document.activeElement.blur();
                moveCursor(e);
            }else if (e.shiftKey){
                selectContainer();
            }else if (e.key === 'Escape'){
                document.activeElement.blur();
                deselectContainer();
            }else if (e.key === 'Tab' ||(e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft'))){
                e.preventDefault();
                focusNextField(e.key);
            }else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const range = window.getSelection().getRangeAt(0);
                const caretPosition = range.endOffset;
                if (caretPosition === 0 && e.key === 'ArrowLeft'){
                    focusNextField('autoLeft')
                }else if (caretPosition === range.endContainer.length  && e.key === 'ArrowRight'){
                    focusNextField('autoRight')
                }
            }else if (e.key === 'Delete' && document.activeElement.tagName == 'BODY'){
                document.activeElement.blur();
                deleteContainer();
            }else if (e.ctrlKey && e.key === 'c'){
                document.activeElement.blur();
                copyContainer();
            }else if (e.ctrlKey && e.key === 'v'){
                document.activeElement.blur();
                pasteContainer();
            }else if (e.ctrlKey && e.key === 'x'){
                document.activeElement.blur();
                cutContainer();
            }else if (e.ctrlKey && e.key === 'a' && document.activeElement.tagName == 'BODY'){
                deselectContainer();
                e.preventDefault();
                document.activeElement.blur();
                selectAllContainers();
            }else if(e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')){
                document.activeElement.blur();
                moveContainer(e.key);
            }
        }
    }
})

//jump destination ctrl link

function jumpDestination(event) {
    if (event.ctrlKey){
        // console.log('notctrl');
        // console.log(parseInt(event.target.textContent));
        // console.log(event.target.parentElement.parentElement.parentElement.parentElement.querySelector('#lineNumber').textContent);
        destinationElement = document.querySelectorAll('.container:not(#exclude)')[parseInt(event.target.textContent)]
        if (!destinationElement){
            labels = document.querySelectorAll('.container#exclude')
            if (labels){
                labels.forEach(label => {
                    if (label.querySelector('#field1').textContent == event.target.textContent){
                        destinationElement = label
                    }
                })
            }
        }
        destinationElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(destinationElement.firstElementChild);
                    destinationElement.firstElementChild.classList.add('glow')
            
                    setTimeout(() => {
                        destinationElement.firstElementChild.style.transition = 'box-shadow 0.3s ease-in-out'
                        destinationElement.firstElementChild.classList.remove('glow')
                    }, 1000);
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(destinationElement);
        


    }
}


//####################################################################################################################################
// instruction and jump arrow Drag Event,
//####################################################################################################################################
let elementDragged;
let closestContainer = null;
let offsetX, offsetY, isDragging, isDraggingJump = false;
let counter = 0;
let lastX;
let lastY;

function getMouseCoords(e) {
    if (e.type === 'mousemove' || e.type === 'mousedown' || e.type === 'mouseup') {
        x = e.clientX;
        y = e.clientY;
    } else if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
        try {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
            lastX = x;
            lastY = y;
        } catch(error) {
            x = lastX
            y = lastY
        }
    }
    sy = y + window.scrollY
    return {x, y, sy}
}

let isScrollingUp = false;
let isScrollingDown = false;

function scrollPage() {
    if (isScrollingUp && (isDragging || isDraggingJump)) {
        window.scrollBy(0, -10);
        requestAnimationFrame(scrollPage);
    }
    if (isScrollingDown  && (isDragging || isDraggingJump)) {
        window.scrollBy(0, 10);
        requestAnimationFrame(scrollPage);
    }
}

function isScroll(y){
    if (y < 100) {
        if (!isScrollingUp) {
            isScrollingUp = true;
            scrollPage();
        }
    } else {
        isScrollingUp = false;
    }
    if (y > (window.innerHeight - 100)) {
        if (!isScrollingDown) {
            isScrollingDown = true;
            scrollPage();
        }
    } else {
        isScrollingDown = false;
    }
}

const handleMove = (e) => {
    (document.getElementById('debugText2')).textContent = `is dragging : ${isDragging}`;
    if (isDragging) {
        let {x, y, sy} = getMouseCoords(e)
        
        isScroll(y)
        
        closestContainer = null;
        let nY = y - 10;
        
        while (!closestContainer && nY > 0) {
            const elements = document.elementsFromPoint(window.innerWidth / 2, nY);
            for (const tes of elements) {
                if (tes !== elementDragged && tes.classList.contains('container')) {
                    closestContainer = tes;
                    break; 
                }
            }
            nY -= 30;
        }
        if (!closestContainer){
            closestContainer = document.querySelector('.placeHolder')
        }
        
        (document.getElementById('debugText8')).textContent = `above instruction : ${closestContainer?.textContent}`;
        let preview = closestContainer.nextSibling
        if (preview.className !== 'placementPreview'){
            (document.querySelector('.placementPreview'))?.remove();
            closestContainer.insertAdjacentHTML('afterend', 
                `<div class="placementPreview" 
                style=height:${
                    (elementDragged.offsetHeight)- 20}px;></div>`)
            // the value 20 is from :
            //(window.getComputedStyle(elementDragged.querySelector('DIV')).marginBottom) - placementPreview {border-width} * 2;
        }
        (document.getElementById('debugText6')).textContent = `cursor position x ${x}`;
        (document.getElementById('debugText7')).textContent = `cursor position y ${y}`;
        elementDragged.style.left = `${x - offsetX}px`;
        elementDragged.style.top = `${sy - offsetY}px`;
        elementDragged.style.position = 'absolute'
        elementDragged.style.zIndex = '2';
        let canvas = elementDragged.querySelector('.jumpArrow')
        if (canvas){
            ctx = elementDragged.querySelector('.jumpArrow').getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }else if (isDraggingJump) {
        let {x, y, sy} = getMouseCoords(e)

        isScroll(y)
        
        elementDragged.style.left = `${x - offsetX}px`;
        elementDragged.style.top = `${sy - offsetY}px`;
        elementDragged.style.position = 'absolute'
        elementDragged.style.zIndex = '2';
        elementDragged.style.transform = 'rotate(180deg)'
        
        jump = elementDragged.closest('.container')
        arrow = jump.querySelector('.jumpArrowTriangle')
        canvas = jump.querySelector('.jumpArrow')
        
        jumpRect = jump.getBoundingClientRect()
        arrowRect = arrow.getBoundingClientRect()
        arrowX = arrowRect.left + arrowRect.width / 2
        arrowY = arrowRect.top + arrowRect.height / 2
        jumpRectRight = jumpRect.right
        jumpRectLeft = jumpRect.left
        jumpRectMiddle = jumpRect.bottom - jumpRect.height / 2
        canvasWidth = arrowX - jumpRectRight
        AcanvasWidth = Math.abs(canvasWidth)
        // console.log(x);
        // console.log(jumpRectRight);
        canvasHeight = arrowY - jumpRectMiddle
        AcanvasHeight = Math.abs(canvasHeight)
        let curveTo;
        let moveTo;
        let plus = 0
        let q3 = false
        if (canvasHeight < 0) {
            canvas.style.bottom = `5%`
            canvas.style.top = ''
            moveTo = [
                0, AcanvasHeight + 20
            ]
            curveTo = [
                70, AcanvasHeight - 20,
                AcanvasWidth + 70, 20,
                AcanvasWidth + 10, 10
            ]
            plus = 40
        } else {
            
            if (canvasWidth > 0) {
                moveTo = [
                    0, 10
                ]
                curveTo = [
                    70 , 20,
                    AcanvasWidth + 70, AcanvasHeight + 20,
                    AcanvasWidth + 10, AcanvasHeight
                ]
                plus = 40
            } else {
                q3 = true
                moveTo = [
                    AcanvasWidth + 5, 10
                ]
                curveTo = [
                    AcanvasWidth + 70, 20,
                    70, AcanvasHeight + 20, 
                    15, AcanvasHeight
                ]
                plus = 0
            }
            canvas.style.top = `5%`
            canvas.style.bottom = ''

        }
        canvas.height = Math.abs(canvasHeight) + 30

        if  (canvasWidth < 0){
            canvas.style.right = '-60px'
            canvas.style.left = 'auto'
            if (q3 == false){
                moveTo = [
                    AcanvasWidth + 5, AcanvasHeight + 20
                ]
                curveTo = [
                    AcanvasWidth + 70, AcanvasHeight - 20,
                    70, 0,
                    10, 10
                ]
                plus = 0
            }
        }else {
            canvas.style.left = `100%`
            canvas.style.right = ''

        }
        canvas.width = Math.abs(canvasWidth) + 60
        const ctx = canvas.getContext('2d');
        
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(moveTo[0],moveTo[1])
        ctx.bezierCurveTo(curveTo[0], curveTo[1], 
                        curveTo[2], curveTo[3],
                        curveTo[4], curveTo[5])
        ctx.stroke()
        ctx.closePath()

    }
}; 
document.addEventListener('mousemove', handleMove)
document.addEventListener('touchmove', handleMove)
    


function MouseDown(blocks,parent) {
    const handleStart = (e) => {
        const {x, y, sy} = getMouseCoords(e)
        if (document.elementFromPoint(x, y) == blocks){
            isDragging = true;
            e.preventDefault() // prevent scrolling for touch scroll devices
            deselectContainer();
            elementDragged = e.target.closest('.container')
            offsetX = x - elementDragged.offsetLeft;
            offsetY = sy - elementDragged.offsetTop;
            // blocks.style.cursor = 'grabbing';
        }
    };
    const handleStartJump = (e) => {
        const {x, y, sy} = getMouseCoords(e)
        if (document.elementFromPoint(x, y) == blocks){
            isDraggingJump = true;
            e.preventDefault() // prevent scrolling for touch scroll devices
            deselectContainer();
            elementDragged = e.target.closest('.jumpArrowTriangle')
            offsetX = x - elementDragged.offsetLeft;
            offsetY = sy - elementDragged.offsetTop;
        }
    };
    if (blocks.tagName == 'DIV') {
        parent.hasDown = true;
        blocks.addEventListener('mousedown', handleStart)
        blocks.addEventListener('touchstart', handleStart)
    } else if (blocks.tagName == 'IMG') {
        parent.hasDownJump = true;
        blocks.addEventListener('mousedown', handleStartJump)
        blocks.addEventListener('touchstart', handleStartJump)
    }
}

const handleEnd = (e) => {
    const pfstart = performance.now();
    if (isDragging || isDraggingJump) {
        if (elementDragged) {
            elementDragged.style.position = ''
            if (isDragging) {
                elementDragged.style.zIndex = '';
            }else {
                elementDragged.style.zIndex = '6';
            }
            elementDragged.style.transform = ''
            if (isDragging == true) {
                isDragging = false;
                const previews = document.querySelectorAll('.placementPreview')
                previews.forEach(preview => {
                    preview.remove();
                })
                document.body.insertBefore(elementDragged, (closestContainer)?.nextSibling);
            } else {
                isDraggingJump = false;
                elementDragged.style.top = 'auto'
                elementDragged.style.left = 'auto'
                const {x, y} = getMouseCoords(e)
                const elements = document.elementsFromPoint(x, y);
                let element;
                for (const elemen of elements) {
                    if (elemen.classList.contains('container')) {
                        element = elemen
                        break;
                    }
                }
                const container = element?.closest('.container')
                lineNumberElement = container?.querySelector('#lineNumber')
                lineNumber = lineNumberElement?.textContent
                if (!lineNumber){
                    lineNumber = container?.querySelector('#field1').textContent
                }
                parent = elementDragged.closest('.container')
                thisLineNumber = parent.querySelector('#field1Value')
                thisLineNumber.textContent = lineNumber
            }
            elementDragged = null;
            updateLineNumber();
        }
        const pfend = performance.now();
        (document.getElementById('debugText5')).textContent = (`drag performance: ${pfend - pfstart} milliseconds`);
    }
};

document.addEventListener('mouseup',handleEnd)
document.addEventListener('touchend',handleEnd)


//####################################################################################################################################
// instruction fields popupmenu
// this whole section is an absolute fucking mess
//####################################################################################################################################
function getContentSize(element){
    const style = getComputedStyle(element);

    console.log(element.clientWidth);
    console.log(element.clientHeight);
    const width = element.clientWidth 
    - parseFloat(style.paddingLeft)
    - parseFloat(style.paddingRight);
    const height = element.clientHeight
    - parseFloat(style.paddingTop)
    - parseFloat(style.paddingBottom);

    return [width, height];
}
var clickedMenu;
var bgclickedMenu;
var popUpMenuElement;
var performanceStart;
var performanceEnd;
function positionPopUpMenu(event, id, ignoreCursor) {
    const menu = document.getElementById(id);
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    if (!ignoreCursor) {
        const posX = event.clientX;
        const posY = event.clientY;
        menu.style.top = `${posY - menuHeight / 2}px`;
        menu.style.left = `${posX - menuWidth / 2}px`;
    }
    const poprect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (poprect.left < 0) menu.style.left = '0px';
    if (poprect.top < 0) menu.style.top = '0px';
    if (poprect.right > viewportWidth) menu.style.left = `${viewportWidth - poprect.width}px`;
    if (poprect.bottom > viewportHeight) menu.style.top = `${viewportHeight - poprect.height}px`;
}
function popUpMenu(event,id,from){
    // console.log(event);

    popUpMenuElement = document.getElementById(id);
    sensorMenuButtons = document.getElementById('sensorMenuButtons')
    //use children instead of childNodes to only include HTML elements
    let buttons = Array.from(sensorMenuButtons.children)
    buttons.forEach(button => {
        button.id = from
    })

    let payloadsDisplay = document.getElementById('payloads').style.display

    if (from == 'prop'){
        let variablesDisplay = document.getElementById('variables').style.display
        if (variablesDisplay == 'block' || payloadsDisplay == 'block') {
            variablesDisplay = 'none'
            payloadsDisplay = 'none'
            document.getElementById('setProp').style.display = 'block'
        }
        document.querySelector('.payloadImg').style.display = 'none';
        sensorMenuButtons.style.display = '';
        buttons.forEach(button => button.style.width = '27%');
        
    }else if (from == 'sensor'){
        let propDisplay = document.getElementById('setProp').style.display
        if (propDisplay == 'block') {
            document.getElementById('variables').style.display = 'block'
            payloadsDisplay = 'block'
            propDisplay = 'none'
        }
        document.querySelector('.payloadImg').style.display = '';
        sensorMenuButtons.style.display = '';
        buttons.forEach(button => button.style.width = '21%');
    }

    // console.log(sensorMenu)
    bgclickedMenu = popUpMenuElement.parentElement
    popUpMenuElement.style.display = 'block';
    bgclickedMenu.style.display = 'flex'
    clickedMenu = event.target;

    positionPopUpMenu(event, id);

    if (!popUpMenuElement.hasClick) {
        popUpMenuElement.addEventListener('click', function(event) {
            selectOption(event,id); 
        });
        popUpMenuElement.hasClick = true;
    }
}

function subSensorMenu(type,event){
    const from = event.target.id
    console.log(from);

    const items = document.getElementById('items')
    const liquids = document.getElementById('liquids')
    const payloads = document.getElementById('payloads')

    if (from == 'sensor'){
        variables = document.getElementById('variables')
        document.getElementById('setProp').style.display = 'none'
        payloads.style.display = 'block'
    }else if (from == 'prop'){
        variables = document.getElementById('setProp')
        document.getElementById('variables').style.display = 'none'
        payloads.style.display = 'none'
    }

    switch (type){
        case 0:
            variables.style.display = 'block'
            items.style.display = 'none'
            liquids.style.display = 'none'
            payloads.style.display = 'none'
            break;
        case 1:
            variables.style.display = 'none'
            items.style.display = 'block'
            liquids.style.display = 'none'
            payloads.style.display = 'none'
            break;
        case 2:
            variables.style.display = 'none'
            items.style.display = 'none'
            liquids.style.display = 'block'
            payloads.style.display = 'none'
            break;
        case 3:
            variables.style.display = 'none'
            items.style.display = 'none'
            liquids.style.display = 'none'
            payloads.style.display = 'block'
    }
    positionPopUpMenu(event, 'sensorMenu', true)
}

const clickHandler = (event) => popUpMenu(event, 'drawMenuAlign');
function selectOption(event,id,isImport,importSelectionValue,isOnInput,from) {
    performanceStart = performance.now();
    function removeField3Event(field) {
        field.hasEvent = false;
        field.removeEventListener('click', (clickHandler));
    }

    let invalid = false;
    let option;
    let targetId
    const eventTarget = event?.target

    // console.log(event);
    if (!isImport){
        if (!isOnInput){
            
            event.stopPropagation();
            let span;
            let prefix;
            if (clickedMenu.tagName == 'IMG'){
                span = clickedMenu.previousElementSibling
            } else {
                span = clickedMenu
            }
            if (id == 'soundMenu'){
                prefix = '@sfx-'
            }
        
            targetId = eventTarget.id
            // console.log(targetId);
            
            if (eventTarget.tagName == 'IMG' || eventTarget.className == "popUpMenu") {
                return
                }
            
            option = eventTarget.textContent
            span.textContent = (prefix || '') + option;
            // console.log(eventTarget);
        } else {
            clickedMenu = eventTarget

            popUpMenuElement = document.getElementById(id);
            

            if (from == 'prop'){
                const variablesDisplay = document.getElementById('variables').style.display
                const payloadsDisplay = document.getElementById('payloads').style.display
                if (variablesDisplay == 'block' || payloadsDisplay == 'block') {
                    document.getElementById('variables').style.display = 'none'
                    payloadsDisplay = 'none'
                    document.getElementById('setProp').style.display = 'block'
                }
                

            }else if (from == 'sensor'){
                const propDisplay = document.getElementById('setProp').style.display
                if (propDisplay == 'block') {
                    document.getElementById('variables').style.display = 'block'
                    document.getElementById('payloads').style.display = 'block'
                    document.getElementById('setProp').style.display = 'none'
                }
            }

            bgclickedMenu = popUpMenuElement.parentElement
            
            // if (id == 'opSuggestion'){
            //     popUpMenuElement.style.display = 'flex'
            // } else {
                popUpMenuElement.style.display = 'block';
            
            bgclickedMenu.style.display = 'flex'
            bgclickedMenu.classList.add("autoCompleteMenu")
            texts = popUpMenuElement.querySelectorAll("*");

            if (!clickedMenu.dataset.hasBlurListener){
                clickedMenu.addEventListener("blur",function(){
                    bgclickedMenu.classList.remove("autoCompleteMenu")
                    bgclickedMenu.style.display = 'none'
                    popUpMenuElement.style.display = 'none'
                    texts.forEach(text => {
                        text.style.display = ''
                    })
                })
                clickedMenu.dataset.hasBlurListener = 'true'
            }

            let selection = window.getSelection();
            if (!selection.rangeCount) return { x: 0, y: 0 };
        
            let range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
        
            let rect = range.getBoundingClientRect();
            // console.log(rect.left);
            // console.log(rect.bottom);
            // console.log(rect.right);
            // console.log(rect.bottom);
            
            const menu = popUpMenuElement;
            let posX
            let posY
            if ((rect.right == 0) && (rect.bottom == 0)){
                const box = eventTarget.getBoundingClientRect()
                posX = box.left
                posY = box.bottom
            } else {
                posX = rect.right;
                posY = rect.bottom;
            }
            menu.style.top = `${posY}px`;
            menu.style.left = `${posX}px`;


            option = eventTarget.textContent

            const query = option;
            
            
            texts.forEach(save => {
                const text = save.textContent;
                if (text.includes(query)){
                    save.style.display = ""
                }else { 
                    save.style.display = "none"
                }
            })
            document.getElementById('sensorMenuButtons').style.display = 'none'

            if (!Array.from(texts).some(node => node.textContent.trim() == option)){
                eventTarget.style.outlineColor = 'red'
                eventTarget.style.setProperty("border-color", "red", "important")
                invalid = true
            } else {
                eventTarget.style.removeProperty("border-color")
                eventTarget.style.outlineColor = ''
            }
            // const poprect = menu.getBoundingClientRect();
            // const viewportWidth = window.innerWidth;
            // const viewportHeight = window.innerHeight;
            // if (poprect.left < 0) menu.style.left = '0px';
            // if (poprect.top < 0) menu.style.top = '0px';
            // if (poprect.right > viewportWidth) menu.style.left = `${viewportWidth - poprect.width}px`;
            // if (poprect.bottom > viewportHeight) menu.style.top = `${viewportHeight - poprect.height}px`;
            
        }
        if (id == "drawMenu" && option != "print") {
            removeField3Event((clickedMenu.parentElement.querySelector('[order="3"]')));
        }
    }else {
        clickedMenu = isImport
        option = importSelectionValue
    }
    
    const fields = clickedMenu.parentElement.querySelectorAll('.toggleableField')



    // Switch case for every pop up menu context that changes its instruction fields 
    function main(which,textWhich){
        fields.forEach(field => {
            if (which){
                if (which.includes(Number(field.getAttribute('order')))){
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            }
            if (textWhich){
                for (let [key, value] of Object.entries(textWhich)) {
                    if (Number(field.getAttribute('order')) == key){
                        field.textContent = value;
                    }
                }
            }
        })
    }
    switch(id){
        case 'setRuleMenu':
            switch(option){
                case 'mapArea':
                    main([11,3,4,5,6], {11: '='})
                    break;
                case 'ban':
                case 'unban':
                    main([11,2], {11: 'block/unit'})
                    break;
                default:
                    main([11,2], {11: '='})
            }
            break;
        case 'effectMenu': 
            switch(option){
                case 'warn':
                case 'cross':
                case 'spawn':
                case 'bubble':
                    main([2, 3]);
                    break;
                case 'blockFall':
                    main([2, 3, 4], {44: 'data'});
                    break;
                case 'placeBlock':
                case 'placeBlockSpark':
                case 'breakBlock':
                    main([2, 3, 4], {44: 'size'});
                    break;
                case 'trail':
                case 'breakProp':
                case 'lightBlock':
                case 'crossExplosion':
                case 'wave':
                    main([2, 3, 4, 5, 44, 55], {44: 'size', 55: 'color'});
                    break;
                case 'smokeCloud':
                case 'vapor':
                case 'hit':
                case 'hitSquare':
                case 'spark':
                case 'sparkBig':
                case 'drill':
                case 'drillBig':
                case 'smokePuff':
                case 'sparkExplosion':
                    main([2, 3, 5, 55], {55: 'color'});
                    break;
                case 'shootSmall':
                case 'shootBig':
                case 'smokeColor':
                case 'smokeSquareBig':
                case 'sparkShoot':
                case 'sparkShootBig':
                    main([2, 3, 4, 5, 44, 55], {44: 'rotation', 55: 'color'});
                    break;
                case 'smokeBig':
                    main([2, 3, 4, 44], {44: 'rotation'});
                    break;
                case 'explosion':
                    main([2, 3, 4, 44], {44: 'size'});
                    break;
            }
            break;
        case 'fetchMenu':
            switch(option){
                case 'unit':
                    main([4,44,5,55], {44: '#', 55: 'unit'})
                    break;
                case 'unitCount':
                    main([5,55], {55: 'unit'})
                    break;
                case 'player':
                case 'core':
                    main([4,44], {44: '#'})
                    break;
                case 'playerCount':
                case 'coreCount':
                    main([-1], false)
                    break;
                case 'build':
                    main([4,44,5,55], {44: '#', 55: 'block'})
                    break;
                case 'buildCount':
                    main([5,55], {55: 'block'})
                    break;
            }
            break;
        case 'controlMenu':
            switch(option){
                case 'enabled':
                case 'config':
                case 'color':
                    main([2, 3, 33], {33: 'to'})
                    break;
                case 'shoot':
                    main([2, 3, 4, 5, 33, 44, 55], {33: 'x', 44: 'y', 55: 'shoot'})
                    break;
                case 'shootp':
                    main([2, 3, 4, 33, 44], {33: 'unit', 44: 'shoot'})
                    break;
            }
            break;
        case 'setMarkerMenu':
            switch(option){
                case 'remove':
                    main([22, 2], {22: 'of id#'})
                    break;
                case 'world':
                case 'minimap':
                case 'autoscale':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'true/false'})
                    break;
                case 'pos':
                case 'endPos':
                    main([22, 2, 33, 3, 44, 4], {22: 'of id#', 33: 'x', 44: 'y'})
                    break;
                case 'drawLayer':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'layer'})
                    break;
                case 'color':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'color'})
                    break;
                case 'radius':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'radius'})
                    break;
                case 'stroke':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'stroke'})
                    break;
                case 'rotation':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'rotation'})
                    break;
                case 'shape':
                    main([22, 2, 33, 3, 44, 4, 55, 5], {22: 'of id#', 33: 'sides', 44: 'fill', 55: 'outline'})
                    break;
                case 'arc':
                    main([22, 2, 33, 3, 44, 4], {22: 'of id#', 33: 'start', 44: 'end'})
                    break;
                case 'flushText':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'fetch'})
                    break;
                case 'fontSize':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'size'})
                    break;
                case 'textHeight':
                    main([22, 2, 33, 3], {22: 'of id#', 33: 'height'})
                    break;
                case 'labelFlags':
                    main([22, 2, 33, 3, 44, 4], {22: 'of id#', 33: 'background', 44: 'outline'})
                    break;
                case 'texture':
                    main([22, 2, 33, 3, 44, 4], {22: 'of id#', 33: 'printFlush', 44: 'name'})
                    break;
                case 'textureSize':
                    main([22, 2, 33, 3, 44, 4], {22: 'of id#', 33: 'width', 44: 'height'})
                    break;
                case 'posi':
                    main([22, 2, 33, 3, 44, 4, 55, 5], {22: 'of id#', 33: 'index', 44: 'x', 55: 'y'})
                    break;
                case 'uvi':
                    main([22, 2, 33, 3, 44, 4, 55, 5], {22: 'of id#', 33: 'index', 44: 'x', 55: 'y'})
                    break;
                case 'colori':
                    main([22, 2, 33, 3, 44, 4], {22: 'of id#', 33: 'index', 44: 'color'})
                    break;
            }
            break;
        case 'jumpMenu':
            switch (option){
                case 'always':
                    main([1,2])
                    break;
                case '==':
                case 'not':
                case '<':
                case '<=':
                case '>':
                case '>=':
                case '===':
                    main([1,2,3,4])
                    break;
            }
            break;
        case 'drawMenu':
            switch(option){
                case 'clear':
                    main([11,22,33,1,2,3])
                    break;
                case 'color':
                    main([11,22,33,44,1,2,3,4])
                    break;
                case 'col':
                    main([11,1], {11 : 'color'})
                    break;
                case 'stroke':
                    main([1])
                    break;
                case 'line':
                    main([11,22,33,44,1,2,3,4], {11: 'x', 22: 'y', 33: 'x2', 44: 'y2'})
                    break;
                case 'rect':
                case 'lineRect':
                    main([11,22,33,44,1,2,3,4], {11: 'x',22: 'y',33: 'width',44: 'height'})
                    break;
                case 'poly':
                case 'linePoly':
                    main([11,22,33,44,55,1,2,3,4,5], {11: 'x', 22: 'y', 33: 'sided', 44: 'radius', 55: 'rotation'})
                    break;
                case 'triangle':
                    main([11,22,33,44,55,66,1,2,3,4,5,6], {11:'x',22:'y',33:'x2',44:'y2',55:'x3',66:'y3'})
                    break;
                case 'image':
                    main([11,22,33,44,55,1,2,3,4,5], {11:'x',22:'y',33:'image',44:'size',55:'rotation'})
                    break;
                case 'print':
                    main([11,22,33,1,2,3], {11:'x',22:'y',33:'align'})
                    fields.forEach(field => { //ugly (reloop)
                        if ([3].includes(Number(field.getAttribute('order')))){
                            field.textContent = "center"
                            if (!(field.hasEvent)){
                                field.hasEvent = true
                                field.addEventListener('click', clickHandler); 
                            }
                        }
                    })
                    break;
                case 'translate':
                case 'scale':
                    main([11,22,1,2], {11:'x',22:'y'})
                    break;
                case 'rotate':
                    main([11,1], {11:'degrees'})
                    break;
            }
            break;
        case 'ucontrolMenu':
            switch (option){
                case 'reset':
                case 'idle':
                case 'stop':
                case 'autoPathfind':
                case 'payDrop':
                case 'payEnter':
                case 'unbind':
                    main([-1])
                    break;
                case 'move':
                case 'pathfind':
                case 'mine':
                    main([11,22,1,2], {11:'x',22:'y'})
                    break;
                case 'approach':
                    main([11,22,33,1,2,3], {11:'x',22:'y',33:'radius'})
                    break;
                case 'boost':
                    main([11,1], {11:'enable'})
                    break;
                case 'target':
                    main([11,22,33,1,2,3], {11:'x',22:'y',33:'shoot'})
                    break;
                case 'targetp':
                    main([11,22,1,2], {11:'unit',22:'shoot'})
                    break;
                case 'itemDrop':
                    main([11,22,1,2], {11:'to',22:'amount'})
                    break;
                case 'itemTake':
                    main([11,22,33,1,2,3], {11:'from',22:'item',33:'amount'})
                    break;
                case 'payTake':
                    main([11,1], {11:'takeUnits'})
                    break;
                case 'itemTake':
                    main([11,22,33,1,2,3], {11:'from',22:'item',33:'amount',})
                    break;
                case 'flag':
                    main([11,1], {11:'value'})
                    break;
                case 'build':
                    main([11,22,33,44,55,1,2,3,4,5], {11:'x',22:'y',33:'block',44:'rotation',55:'config'})
                    break;
                case 'getBlock':
                    main([11,22,33,44,55,1,2,3,4,5], {11:'x',22:'y',33:'type',44:'building',55:'floor'})
                    break;
                case 'within':
                    main([11,22,33,44,1,2,3,4], {11:'x',22:'y',33:'radius',44:'result'})
                    break;
            }
            break;
        case 'ulocateFindMenu':
            switch (option){
                case 'ore':
                    main([33,3])
                    break;
                case 'building':
                    main([11,22,1,2])
                    break;
                case 'damaged':
                case 'spawn':
                    main([-1])
                    break;
            }
            break;
        case 'setBlockMenu':
            switch (option){
                case 'ore':
                case 'floor':
                case 'block':
                    main([5,6])
                    break;
            }
            break;
        case 'flushMessageMenu':
            switch (option){
                case 'notify':
                case 'mission':
                    main([2])
                    break;
                case 'announce':
                case 'toast':
                    main([1,3])
                    break;
            }
            break;
        case 'cutsceneMenu':
            switch (option){
                case 'pan':
                    main([22,2,3,4], {22:'x'})
                    break;
                case 'zoom':
                    main([1,22,2], {22:'level'})
                    break;
                case 'stop':
                    main([1])
                    break;
            }
            break;
        default:
            console.log('something went wrong');
    }
    if(!isImport && !isOnInput){
        closeMenu(event);
    }
    performanceEnd = performance.now();
    (document.getElementById('debugText4')).textContent = (`Pop up menu performance: ${performanceEnd - performanceStart} milliseconds`);
    console.log(`Execution time: ${performanceEnd - performanceStart} milliseconds`);
}

function valueToggle(event){
    const target = event.target;
    const value = target.textContent;
    const type = JSON.parse(target.getAttribute('switch'))
    if (value != type[0]){
        target.textContent = type[0]
    }else {
        target.textContent = type[1]
    }
    fields = target.parentElement.querySelectorAll('.toggleableField')

    function main(which,textWhich){
        fields.forEach(field => {
            if (which){
                if (which.includes(Number(field.getAttribute('order')))){
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            }
            if (textWhich){
                for (let [key, value] of Object.entries(textWhich)) {
                    if (Number(field.getAttribute('order')) == key){
                        field.textContent = value;
                    }
                }
            }
        })
    }
    switch(target.textContent) {
        case 'clear':
            main([1,2,3,33], {33: 'from'})
            break;
        case 'apply':
            main([4], {33: 'to'})
            break;
        case 'global':
            main([11,1])
            break;
        case 'positional':
            main ([2,22,3,33])
    }

}

function closeMenu(event) {
    // console.log('close');
    popUpMenuElement.style.display = 'none';
    event.stopPropagation();
    bgclickedMenu.style.display = 'none'
}


//####################################################################################################################################
// selection keybinds event
//####################################################################################################################################
// the term "cursor" is the highlighed block/instruction (the one that is indicated by an orange outline)
// also this whole section is a mess and needs to be refactored (maybe)
let cursorContainer
function EnableCursor(){
    if (!cursorContainer){
        cursorContainer = document.querySelector('.container')
        cursorContainer.classList.add('cursor') 
    }else if (cursorContainer){
        cursorContainer.classList.remove('cursor')
        cursorContainer = null
    }
}

let directionDown
function moveCursor(key){
    const rect = cursorContainer.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
        cursorContainer.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    }
    if (key.key == 'ArrowDown'){
        let next
        directionDown = true
        function moveCursorDown(){
            cursorContainer.classList.remove('cursor')
            next.classList.add('cursor')
            cursorContainer = next
            if (key.shiftKey){
                selectContainer();
            } else {
                deselectContainer();
            }
        }
        next = cursorContainer.nextElementSibling
        if (next?.classList.contains('container')){
            moveCursorDown()
        }else if (cursorContainer.parentElement.className.includes('group')){
            next = cursorContainer.parentElement.nextElementSibling
            if (next?.classList.contains('container')){
                moveCursorDown()
            }else {
                return
            }
        }else{
            return
        }
    }else if (key.key == 'ArrowUp'){
        let previous
        directionDown = false
        function moveCursorUp(){
            cursorContainer.classList.remove('cursor')
            previous.classList.add('cursor')
            cursorContainer = previous
            if (key.shiftKey){
            selectContainer();
            } else {
            deselectContainer();
            }
        }
        previous = cursorContainer.previousElementSibling
        if (previous?.classList.contains('container')){
            moveCursorUp()
        }else if (cursorContainer.parentElement.className.includes('group')){
            previous = cursorContainer.parentElement.previousElementSibling
            if (previous?.classList.contains('container')){
                moveCursorUp()
            }else {
                return
            }
        }else{
            return
        }
    }
    if (currentFocusIndex > limitFocusIndex){
        currentFocusIndex -= 1
    }

}

let selectedDiv;
function selectContainer(){
    if (document.activeElement.tagName == 'BODY' && !cursorContainer.classList.contains('placeHolder')){
        cursorContainer.classList.add('selected')
        if (!selectedDiv){
            selectedDiv = document.createElement('div');
            selectedDiv.classList.add('group');
        }
        cursorContainer.insertAdjacentElement('afterend', selectedDiv);

        if (directionDown == true){
            selectedDiv.appendChild(cursorContainer);
        }else{
            selectedDiv.insertBefore(cursorContainer, selectedDiv.firstChild);
        }
    }else {
        return
    }
}

function selectAllContainers(){
    const containers = document.querySelectorAll('.container')
    containers.forEach(container => {
        container.classList.add('selected')
        if (!selectedDiv){
            selectedDiv = document.createElement('div');
            selectedDiv.classList.add('group');
            container.insertAdjacentElement('afterend', selectedDiv);
        }
        selectedDiv.appendChild(container);
    })
}

function deselectContainer(){
    if (selectedDiv) {
        while (selectedDiv.firstChild) {
            selectedDiv.parentNode.insertBefore(selectedDiv.firstChild, selectedDiv);
        }
        selectedDiv.remove();
    }
    document.querySelectorAll('.selected').forEach(selected => {
        selected.classList.remove('selected')
    })
    selectedDiv = null
}
let currentFocusIndex = 0;
let limitFocusIndex
let focusableElements
function focusNextField(direction){
    if (!focusableElements || (focusableElements[0]?.closest('.container')) != cursorContainer){
        focusableElements = cursorContainer.querySelectorAll('.editable')
        focusableElements = Array.from(focusableElements).filter(element => getComputedStyle(element).display !== 'none')
    }
    limitFocusIndex = currentFocusIndex
    if (direction == 'ArrowRight' || direction == 'Tab'){
        currentFocusIndex += 1
    } else if (direction == 'ArrowLeft'){
        currentFocusIndex -= 1
    } else if (direction == 'autoRight'){
        let focusedElement
        focusedElement = document.activeElement;
        currentFocusIndex = focusableElements.indexOf(focusedElement)
        currentFocusIndex += 1
    } else if (direction == 'autoLeft'){
        let focusedElement
        focusedElement = document.activeElement;
        currentFocusIndex = focusableElements.indexOf(focusedElement)
        currentFocusIndex -= 1
    }
    if (focusableElements.length > 0) {
        if (currentFocusIndex < 0){
            currentFocusIndex = focusableElements.length - 1
        }
        currentFocusIndex = Math.abs((currentFocusIndex) % focusableElements.length);
    }
    focusableElements[currentFocusIndex].focus();
    

}

function deleteContainer(){
    if (selectedDiv?.classList.contains('group')){
        if (selectedDiv.nextElementSibling.classList.contains('container')) {
            next = selectedDiv.nextElementSibling;
        } else {
            next = selectedDiv.previousElementSibling;
        }
        next.classList.add('cursor') 
        selectedDiv.remove()
        selectedDiv = null
        cursorContainer = next
    }else if (cursorContainer.classList.contains('container')){
        if (cursorContainer.nextElementSibling.classList.contains('container')) {
            next = cursorContainer.nextElementSibling;
        } else {
            next = cursorContainer.previousElementSibling;
        }
        next.classList.add('cursor') 
        cursorContainer.remove()
        cursorContainer = next
    }
    updateLineNumber();
    
}
let clone;
function copyContainer(){
    if (selectedDiv){
        clone = selectedDiv.cloneNode(true)
    }else if (cursorContainer){
        clone = cursorContainer.cloneNode(true)
    }
    updateLineNumber();
    return clone
}

function cutContainer() {
    if (selectedDiv) {
        clone = selectedDiv.cloneNode(true);
        if (selectedDiv.nextElementSibling.classList.contains('container')) {
            next = selectedDiv.nextElementSibling;
        } else {
            next = selectedDiv.previousElementSibling;
        }
        next.classList.add('cursor');
        selectedDiv.remove();
        selectedDiv = null;
        cursorContainer = next;
    } else if (cursorContainer) {
        clone = cursorContainer.cloneNode(true);
        if (cursorContainer.nextElementSibling.classList.contains('container')) {
            next = cursorContainer.nextElementSibling;
        } else {
            next = cursorContainer.previousElementSibling;
        }
        next.classList.add('cursor');
        cursorContainer.remove();
        cursorContainer = next;
    }
    updateLineNumber();
}

function pasteContainer(){
    if (clone) {
        const clonedContainers = Array.from(clone.querySelectorAll('.container')).reverse();
        clonedContainers.forEach(clonedElement => {
            const newClone = clonedElement.cloneNode(true);
            newClone.classList.remove('selected', 'cursor');
            cursorContainer.insertAdjacentElement('afterend', newClone);
        });
    }
    deselectContainer();
    updateLineNumber();
}

function moveContainer(direction){
    if (!selectedDiv){
        return
    }
    if (direction == 'ArrowUp'){
        const previousSibling = selectedDiv.previousElementSibling;
        if (previousSibling.classList.contains('container')) {
            selectedDiv.parentNode.insertBefore(selectedDiv, previousSibling);
        }
    }else if (direction == 'ArrowDown'){
        const nextSibling = selectedDiv.nextElementSibling;
        if (nextSibling.classList.contains('container')) {
            selectedDiv.parentNode.insertBefore(nextSibling, selectedDiv);
        }
    }
    updateLineNumber();
}


//####################################################################################################################################
// Export functions
//####################################################################################################################################
const operatorMap = {
    "+"         : 'add',
    "-"         : 'sub',
    "*"         : 'mul',
    "/"         : 'div',
    "//"        : 'idiv',
    "%"         : 'mod',
    "^"         : 'pow',
    "=="        : 'equal',
    'not'       : 'notEqual',
    "and"       : 'land',
    "<"         : 'lessThan',
    "<="        : 'lessThanEqual',
    ">"         : 'greaterThan',
    ">="        : 'greaterThanEqual',
    "==="       : 'strictEqual',
    "<<"        : 'shl',
    ">>"        : 'shr',
    "or"        : 'or',
    "b-and"     : 'and',
    "xor"       : 'xor',
    "flip"      : 'not',
    "max"       : 'max',
    "min"       : 'min',
    "angle"     : 'angle',
    "anglediff" : 'angleDiff',
    "len"       : 'len',
    "noise"     : 'noise',
    "abs"       : 'abs',
    "log"       : 'log',
    "log10"     : 'log10',
    "floor"     : 'floor',
    "ceil"      : 'ceil',
    "sqrt"      : 'sqrt',
    "rand"      : 'rand',
    "sin"       : 'sin',
    "cos"       : 'cos',
    "tan"       : 'tan',
    "asin"      : 'asin',
    "acos"      : 'acos',
    "atan"      : 'atan',
    "always"    : 'always',

    'add'               : 'add', // UGLY, idk other way though
    'sub'               : 'sub',
    'mul'               : 'mul',
    'div'               : 'div',
    'idiv'              : 'idiv',
    'mod'               : 'mod',
    'pow'               : 'pow',
    'equal'             : 'equal',
    'notEqual'          : 'notEqual',
    'land'              : 'land',
    'lessThan'          : 'lessThan',
    'lessThanEqual'     : 'lessThanEqual',
    'greaterThan'       : 'greaterThan',
    'greaterThanEqual'  : 'greaterThanEqual',
    'strictEqual'       : 'strictEqual',
    'shl'               : 'shl',
    'shr'               : 'shr',
    'or'                : 'or',
    'and'               : 'and',
    'xor'               : 'xor',
    // 'not'               : 'flip',
    'max'               : 'max',
    'min'               : 'min',
    'angle'             : 'angle',
    'angleDiff'         : 'angleDiff',
    'len'               : 'len',
    'noise'             : 'noise',
    'abs'               : 'abs',
    'log'               : 'log',
    'log10'             : 'log10',
    'floor'             : 'floor',
    'ceil'              : 'ceil',
    'sqrt'              : 'sqrt',
    'rand'              : 'rand',
    'sin'               : 'sin',
    'cos'               : 'cos',
    'tan'               : 'tan',
    'asin'              : 'asin',
    'acos'              : 'acos',
    'atan'              : 'atan',
    'always'            : 'always',
};

let instTypeMap = {
    'Read'          : 'read',
    'Write'         : 'write',
    'Draw'          : 'draw',
    'Print'         : 'print',
    'Format'        : 'format',
    'Draw Flush'    : 'drawflush',
    'Print Flush'   : 'printflush',
    'Get Link'      : 'getlink',
    'Control'       : 'control',
    'Radar'         : 'radar',
    // 'Sensor'        : 'sensor',
    'Set'           : 'set',
    'Operation'     : 'op',
    // 'Lookup'        : 'lookup',
    'Pack Color'    : 'packcolor',
    'Wait'          : 'wait',
    'Stop'          : 'stop',
    'End'           : 'end',
    'Jump'          : 'jump',
    'Unit Bind'     : 'ubind',
    'Unit Control'  : 'ucontrol',
    'Unit Radar'    : 'uradar',
    // 'Unit Locate'   : 'ulocate',
    'Noop'          : 'noop',
    // 'Label'         : 'label',
    'Comment'       : '#',
    'Get Block'     : 'getblock',
    'Set Block'     : 'setblock',
    'Spawn Unit'    : 'spawn',
    // 'Apply Status'  : 'status',
    'Weather Sense' : 'weathersense',
    'Weather Set'   : 'weatherset',
    'Spawn Wave'    : 'spawnwave',
    'Set Rule'      : 'setrule',
    'Flush Message' : 'message',
    'Cutscene'      : 'cutscene',
    'Effect'        : 'effect',
    'Explosion'     : 'explosion',
    'Set Rate'      : 'setrate',
    'Fetch'         : 'fetch',
    'Sync'          : 'sync',
    'Get Flag'      : 'getflag',
    'Set Flag'      : 'setflag',
    'Set Prop'      : 'setprop',
    'Play Sound'    : 'playsound',
    'Set Marker'    : 'setmarker',
    'Make Marker'   : 'makemarker',
    'Locale Print'  : 'localeprint',
    'Print Char'    : 'printchar',

} 
function exportCode(save){
    // deselectContainer();
    codeEx = ""
    containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        insSpan = container.querySelector('span');
        if (insSpan){
            if (codeEx != ''){
                codeEx += '\n'
            }
            let instType = insSpan.textContent;
            if (instTypeMap?.[instType]){
                codeEx += instTypeMap[instType] + ' ';
                let ignoreIgnoreInvisable
                switch (instType){
                    case 'Flush Message':
                    case 'Play Sound':
                    case 'Jump':
                    case 'Operation':
                        ignoreIgnoreInvisable = 1 
                        break;
                    default:
                        ignoreIgnoreInvisable = 0
                        break;
                }
                exportFields(ignoreIgnoreInvisable)
            } else {
                switch (instType){
                    // case 'Jump':
                    //     codeEx += `jump ${
                    //         container.querySelector('#field1Value')?.textContent} ${
                    //         operatorMap[container.querySelector('#field3Value')?.textContent]}`
                    //     exportFields(0)
                    //     break;
                    case 'Sensor':
                        codeEx += `sensor ${
                            container.querySelector('#field1Value')?.textContent} ${
                            container.querySelector('#field3Value')?.textContent} ${
                            container.querySelector('#field2Value')?.textContent}`
                        break;
                    // case 'Operation':
                    //     codeEx += "op "
                    //     operator = container.querySelector('.dontInclude')
                    //     OperatorString = (operator.textContent.replace(/\s+/g, ''));
                    //     codeEx += operatorMap[OperatorString] + ' ';
                    //     exportFields(0)
                    //     break;
                    // case 'Radar':
                    //     codeEx += `radar ${
                    //         container.querySelector('#field2Value')?.textContent} ${
                    //         container.querySelector('#field3Value')?.textContent} ${
                    //         container.querySelector('#field4Value')?.textContent} ${
                    //         container.querySelector('#field6Value')?.textContent} ${
                    //         container.querySelector('#field1Value')?.textContent} ${
                    //         container.querySelector('#field5Value')?.textContent} ${
                    //         container.querySelector('#field7Value')?.textContent}`
                    //     break;
                    case 'Lookup':
                        codeEx += `lookup ${
                            container.querySelector('#field2Value')?.textContent} ${
                            container.querySelector('#field1Value')?.textContent} ${
                            container.querySelector('#field3Value')?.textContent}`
                        break;
                    case 'Unit Radar':
                        codeEx += `uradar ${
                            container.querySelector('#field2Value')?.textContent} ${
                            container.querySelector('#field3Value')?.textContent} ${
                            container.querySelector('#field4Value')?.textContent} ${
                            container.querySelector('#field6Value')?.textContent} 0 ${
                            container.querySelector('#field5Value')?.textContent} ${
                            container.querySelector('#field7Value')?.textContent}`
                            break;
                    case 'Unit Locate':
                        codeEx += `ulocate `
                        exportFields(1)
                        break;
                    case 'Label':
                        codeEx += `${container.querySelector('.code').querySelector('span').textContent}:`
                        break;
                    // if (instType == 'Get Block'){
                    //     codeEx += `getblock ${
                    //         container.querySelector('#field2Value')?.textContent} ${
                    //         container.querySelector('#field1Value')?.textContent} ${
                    //         container.querySelector('#field3Value')?.textContent} ${
                    //         container.querySelector('#field4Value')?.textContent}`
                    // }
                    // if (instType == 'Set Block'){
                    //     codeEx += `setblock ${
                    //         container.querySelector('#field1Value')?.textContent} ${
                    //         container.querySelector('#field4Value')?.textContent} ${
                    //         container.querySelector('#field2Value')?.textContent} ${
                    //         container.querySelector('#field3Value')?.textContent} ${
                    //         container.querySelector('#field4Value')?.textContent} ${
                    //         container.querySelector('#field5Value')?.textContent}`
                    // }
                    case 'Apply Status':
                        let field1 = container.querySelector('[order="1"]')?.textContent;
                        field1 = field1 === 'clear' ? 'true' : (field1 === 'apply' ? 'false' : field1);
                        codeEx += `status ${field1} `
                        exportFields(0)
                        break;
                }

                //im experimenting with 'order', although more readable it might be slower, but again its very negligible
            }
            function exportFields(ignoreIgnoreInvisable){ // @mark
                codeElements = container.querySelectorAll('.editable');
                
                if (codeElements[0]?.hasAttribute('order')){ 
                    codeElements = Array.from(codeElements).sort((a, b) => a.getAttribute('order') - b.getAttribute('order'));
                }
                codeElements.forEach(code => {
                    if (!code.classList.contains('dontInclude') && (ignoreIgnoreInvisable || (getComputedStyle(code)).display === 'block')) {
                        // console.log(code);
                        codeId = code.id
                        if (codeId === 'operation'){
                            codeEx += operatorMap[code.textContent] + ' '
                        }else if (codeId === 'string') {
                            codeEx += (code.textContent + ' ');
                        } else {
                            codeEx += (code.textContent.replace(/\s+/g, '_') + ' ');
                        }
                    }
                });
            }
        };
    });
    if (save){
        return codeEx
    } else {
        navigator.clipboard.writeText(codeEx)
        document.getElementById('alert').classList.remove("alertShow")
        document.getElementById('alert').style.display = 'block'
        setTimeout(() => {
            document.getElementById('alert').classList.add("alertShow");
            setTimeout(() => {
                document.getElementById('alert').style.display = 'none'
            }, 1000);
        }, 1000);
    }
}


let instTypeMapR = {
    'read'      : 'Read',
    'write'     : 'Write',
    'draw'      : 'Draw',
    'print'     : 'Print',
    'format'    : 'Format',
    'drawflush' : 'Draw Flush',
    'printflush': 'Print Flush',
    'getlink'   : 'Get Link',
    'control'   : 'Control',
    'radar'     : 'Radar',
    'sensor'    : 'Sensor',
    'set'       : 'Set',
    'op'        : 'Operation',
    'lookup'    : 'Lookup',
    'packcolor' : 'Pack Color',
    'wait'      : 'Wait',
    'stop'      : 'Stop',
    'end'       : 'End',
    'jump'      : 'Jump',
    'ubind'     : 'Unit Bind',
    'ucontrol'  : 'Unit Control',
    'uradar'    : 'Unit Radar',
    'ulocate'   : 'Unit Locate',

    'getblock'     : 'Get Block',
    'setblock'     : 'Set Block',
    'spawn'        : 'Spawn Unit',
    'status'       : 'Apply Status',
    'weathersense' : 'Weather Sense',
    'weatherset'   : 'Weather Set',
    'spawnwave'    : 'Spawn Wave',
    'setrule'      : 'Set Rule',
    'message'      : 'Flush Message',
    'cutscene'     : 'Cutscene',
    'effect'       : 'Effect',
    'explosion'    : 'Explosion',
    'setrate'      : 'Set Rate',
    'fetch'        : 'Fetch',
    'sync'         : 'Sync',
    'getflag'      : 'Get Flag',
    'setflag'      : 'Set Flag',
    'setprop'      : 'Set Prop',
    'playsound'    : 'Play Sound',
    'setmarker'    : 'Set Marker',
    'localeprint'  : 'Locale Print',
    'printchar'    : 'Print Char',
}
// ########################################################################################################################
// import
// ########################################################################################################################
async function importCode(manual,codeSaved){
    let code
    if (codeSaved){
        code = codeSaved
    } else {
        if (manual != 1){
            try {
                code = await navigator.clipboard.readText();
                // document.getElementById('clipboardContent').innerText = `Clipboard content: ${code}`;
            } catch (err) {
            // console.error('Failed to read clipboard contents: ', err);
            document.getElementById('alert1').classList.remove("alertShow")
            document.getElementById('alert1').style.display = 'block'
    
            // let timeLeft = 4000; // In milliseconds
            // const endTime = Date.now() + timeLeft; // Calculate when the timer should end
            
            // const timer = setInterval(() => {
                //   const now = Date.now();
            //   timeLeft = Math.max(0, endTime - now); // Calculate remaining time
            
            //   document.getElementById('debugText8').textContent = (timeLeft / 1000).toFixed(3); // Display in seconds with milliseconds
            
            //   if (timeLeft <= 0) {
            //     clearInterval(timer);
            //     document.getElementById('debugText8').textContent = "Time's up!";
            //   }
            // }, 10); // Update every 10ms for smoother display
    
            setTimeout(() => {
                document.getElementById('alert1').classList.add("alertShow");
                setTimeout(() => {
                    document.getElementById('alert1').style.display = 'none'
                }, 1000);
            }, 4000);
            return
            }
        }else {
            code = document.getElementById('pasteBox').value
        }
    }
    // console.log(code);
    document.querySelectorAll('.container').forEach(e => e.remove());
    let lines = code.split(/\r?\n/).filter(line => line.trim() !== '');
    // lines = lines.filter(line => line.trim() && !line.trim().startsWith("#"));
    // console.log(lines);
    lines.forEach((line, index) => {
        let words = line.trim().split(/\s+/);
        type = instTypeMapR[words[0]]
        if (type){
            // console.log(type);
            let triggerPopupMenu // @Important, this triggers the popup change fields for imports, add new types here
            if (['Control', 
                'Draw', 
                'Unit Control', 
                'Jump', 
                'Set Rule', 
                'Set Block', 
                'Flush Message', 
                'Cutscene', 
                'Effect', 
                'Fetch',
                'Play Sound',
                'Set Marker'].includes(type)) {
                triggerPopupMenu = true
            }
            addInstruction(type, 0, words[1], words[2], words[3], words[4], words[5], words[6], words[7], words[8], words[9], triggerPopupMenu)
        } else {
            if (words[0].endsWith(":")){
                addInstruction('Label', 0, words[0].replace(":",""))
            }else if (words[0].startsWith("#")) {
                addInstruction('Comment', 0, line.replace("#",""))
            }else {
                addInstruction('Noop', 0)
            }
            
        }
    });
    updateLineNumber()
    closePasteMenu()
}

// ########################################################################################################################
// saves
// ########################################################################################################################
function saveCurrent(autosave){
    let code = exportCode(1)
    if (code == ""){
        code = 'Noop'
    }
    let name = document.getElementById('Name').value
    if (!name){
        name = 'save1'
        let counter = 1;
        while (localStorage.getItem(name)) {
            name = `save${counter}`;
            counter++;
            // console.log(counter);
            // console.log(name);
        }
    }
    // console.log(name);
    if (autosave){
        // const now = new Date();

        // // Extract date components
        // const day = String(now.getDate()).padStart(2, '0');       // Day (DD)
        // const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (MM) - Months are 0-indexed
        // const year = now.getFullYear();                           // Year (YYYY)
        // const hours = String(now.getHours()).padStart(2, '0');    // Hours (HH)
        // const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes (MM)
        // const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds (SS)

        // const formattedDate = `${day}-${month}-${year}-${hours}${minutes}-${seconds}`;

        localStorage.setItem(`autosave#${Date.now()}`, code);
    }else {
        localStorage.setItem(name, code);
        closeNameMenu()
    }
    refreshSaves()
}

let savesText = [];
function refreshSaves(){
    let saves = Object.keys(localStorage)
        .filter(key => !key.includes("autosave#") && !key.includes("setting"))
        .sort()
    // console.log(saves);
    let saveList = document.getElementById('saveList')
    saveList.innerHTML = ''
    savesText = [];
    saves.forEach(save => {
        const saveDiv = document.createElement('div');
        saveDiv.textContent = save;
        saveDiv.addEventListener('click', () => {
            saveDiv.classList.toggle('saveSelected');
        });
        saveList.appendChild(saveDiv);
        savesText.push(saveDiv)
    });
}

function refreshTimeline(){
    let saves = Object.keys(localStorage)
        .filter(key => key.includes("autosave#"))
        .map(key => ({
            key,
            timestamp: parseInt(key.split("#")[1])
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(item => item.key)
        .reverse();
    
    let savedSettings = getSavedSettings()
    let first10Saves = saves.slice(0, savedSettings.buffer);
    saves.forEach(key => {
        if (!first10Saves.includes(key)) {
            localStorage.removeItem(key);
        }
    });

    let timelineList = document.getElementById('timelineList')
    timelineList.innerHTML = ''
    saves.forEach(save => {
        const saveDiv = document.createElement('div');
        const now = new Date((parseInt(save.split("#")[1])));

        // Extract date components
        const day = String(now.getDate()).padStart(2, '0');        // Day (DD)
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (MM) - Months are 0-indexed
        const year = now.getFullYear();                            // Year (YYYY)
        const hours = String(now.getHours()).padStart(2, '0');     // Hours (HH)
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes (MM)
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds (SS)

        const formattedDate = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;


        saveDiv.textContent = `${save.split("#")[0]}#${formattedDate}`;
        saveDiv.dataset.saveFileName = `${save}`; //UGLY

        // saveDiv.textContent = save
        saveDiv.addEventListener('click', () => {
            saveDiv.classList.toggle('saveSelected');
            loadSelected()
        });
        timelineList.appendChild(saveDiv);
    });
}

function loadSelected(){
    let code
    document.querySelectorAll('.saveSelected').forEach(selected => {
        selected.classList.remove('saveSelected')
        if (!code){ 
            code = localStorage.getItem(selected.textContent);
            if (!code) { //UGLY
                code = localStorage.getItem(selected.dataset.saveFileName)
            }
        }
    })
    if(code){
        importCode(0,code)
    }
    closeSaveMenu()
}

function deleteSelected(){
    document.querySelectorAll('.saveSelected').forEach(selected => {
        localStorage.removeItem(selected.textContent);
        selected.remove()
    })
}

const searchBar = document.getElementById("searchBar")


searchBar.addEventListener("input",() => {
    const query = searchBar.value.toLowerCase();
    savesText.forEach(save => {
        const text = save.textContent.toLowerCase();
        if (text.includes(query)){
            save.style.display = ""
        }else { 
            save.style.display = "none"
        }
    })
})

// ####################################################
// autosave controller
// ####################################################
let autosaveIconTimeout;
let autosaveRunInterval;
function autosave() {
    function autosaveRun(){
        saveCurrent(1)
        refreshTimeline()
        const autosaveIconElement = document.getElementById('autosaveIcon')
        autosaveIconElement.style.transition = 'none'
        autosaveIconElement.style.opacity = 1;
    
        if (autosaveIconTimeout) {
            clearTimeout(autosaveIconTimeout);
        }
    
        autosaveIconTimeout = setTimeout(() => {
            autosaveIconElement.style.transition = 'opacity 1s ease-out'
            autosaveIconElement.style.opacity = 0;
        }, 1000)
    }
    let savedSettings = getSavedSettings()
    if (savedSettings.autosave){
        if (autosaveRunInterval) {
            clearInterval(autosaveRunInterval);
        }
        autosaveRunInterval = setInterval(autosaveRun,savedSettings.interval*1000)
        autosaveRun()
    }else{
        clearInterval(autosaveRunInterval);
    }
}


// ########################################################################################################################
// settings
// ########################################################################################################################

function getSavedSettings(){
    let savedSettings = localStorage.getItem('setting')
    if (!savedSettings){
        const defaultSettings = { // @important configure this when adding new settings
            autosave: true, 
            interval: 30,
            buffer: 20,
            showDebug : false,
            // UIScale : 100,
            F2SearchAdd : true,
            addBelowCursor : true,
            removeNotice : false
        } 
        localStorage.setItem('setting', JSON.stringify(defaultSettings))
        savedSettings = defaultSettings
    }else {
        savedSettings = JSON.parse(savedSettings)
    }
    return savedSettings
}

function updateSettingValue(e) {
    const value = e.value + e.dataset.suffix
    e.nextElementSibling.textContent = value
}

function saveSettings(){ // @important configure this when adding new settings
    const setting = document.getElementById('setting')
    // autosave settings
    const isAutosave = setting.querySelector('#autosave').checked
    const interval = setting.querySelector('#interval').value
    const buffer = setting.querySelector('#buffer').value
    // general settings
    const showDebug = setting.querySelector('#showDebug').checked
    const removeNotice = setting.querySelector('#removeNotice').checked
    const UIScale = setting.querySelector('#UIScale').value
    // keybinds
    const F2SearchAdd = setting.querySelector('#focusAddSearchBar').checked
    const addBelowCursor = setting.querySelector('#addInstructionBelowCursor').checked
    const savedSettings = {
        autosave : isAutosave,
        interval : interval,
        buffer : buffer,
        showDebug : showDebug,
        UIScale : UIScale,
        F2SearchAdd : F2SearchAdd,
        addBelowCursor : addBelowCursor,
        removeNotice : removeNotice
    }
    localStorage.setItem('setting',JSON.stringify(savedSettings))
    closeSettingMenu()
    applyUserSetting()
}

function applyUserSetting(){
    let savedSettings = getSavedSettings()
    autosave()
    if (savedSettings.showDebug) {
        document.getElementById('debugMenu').style.display = 'block'
    }else {
        document.getElementById('debugMenu').style.display = 'none'
    }
    if (savedSettings.removeNotice) {
        document.getElementById('notice').style.display = 'none'
    } else {
        document.getElementById('notice').style.display = 'block'
    }
    // document.body.style.zoom = savedSettings.UIScale + "%" //nevermind, everything that uses screen coordinates is broken, will disable this for now
}

function refreshSettingMenu(){
    let savedSettings = getSavedSettings()
    
    document.getElementById('autosave').checked = savedSettings.autosave
    document.getElementById('showDebug').checked = savedSettings.showDebug
    document.getElementById('focusAddSearchBar').checked = savedSettings.F2SearchAdd
    document.getElementById('addInstructionBelowCursor').checked = savedSettings.addBelowCursor

    const interval = document.getElementById('interval')
    const buffer = document.getElementById('buffer')
    const UIScale = document.getElementById('UIScale')
    interval.value = savedSettings.interval
    updateSettingValue(interval)
    buffer.value = savedSettings.buffer
    updateSettingValue(buffer)
    UIScale.value = savedSettings.UIScale
    updateSettingValue(UIScale)

}

//########################################################################################################

window.onload = () => {
    document.getElementById('loadingAlert').style.display = 'none'
    applyUserSetting()
    // autosaveInterval = setInterval(autosave, 10000);
    // openSettingMenu()
    // openSaveMenu()
}