
const buttons = document.querySelectorAll('.addItems');
buttons.forEach(button => {
    button.addEventListener('click', () => addInstruction(button))
});
    
function addInstruction(button){
    if (typeof button == 'string'){
        buttons.forEach(bbuton => {
            if (bbuton.textContent == button){
                button = bbuton
            }
        })

    }
    buttonText = button.textContent;
    divParent = button.parentElement;
    // console.log('divParent')
    // console.log(divParent)
    type = divParent.classList[0];
    // console.log('type')
    // console.log(type)
    closeWizard();
    
    //Switch for every instruction type
    switch (buttonText) {
        case 'Read':
            code = `<span>read</span>
                    <span class="editable iNo" contenteditable="true">result</span>
                    <span>=</span>
                    <span class="editable iNo" contenteditable="true">cell1</span>
                    <span>at</span>
                    <span class="editable iNo" contenteditable="true">0</span>`
            break;
        case 'Write':
            code = `<span>write</span>
                    <span class="editable iNo" contenteditable="true">result</span>
                    <span>=</span>
                    <span class="editable iNo" contenteditable="true">cell1</span>
                    <span>at</span>
                    <span class="editable iNo" contenteditable="true">0</span>`
            break;
        case 'Draw':
            code = `<span class="editable iNo" contenteditable="true" onclick="popUpMenu(event,'drawMenu')">clear</span>
                    <span class="toggleableField" id="field1" style=display:block;>r</span>
                    <span class="editable iNo toggleableField" id="field1Value" contenteditable="true" style=display:block;>0</span>
                    <span class="toggleableField" id="field2" style=display:block;>g</span>
                    <span class="editable iNo toggleableField" id="field2Value" contenteditable="true" style=display:block;>0</span>
                    <span class="toggleableField" id="field3" style=display:block;>b</span>
                    <span class="editable iNo toggleableField" id="field3Value" contenteditable="true" style=display:block;>0</span>
                    <span class="toggleableField" id="field4">a</span>
                    <span class="editable iNo toggleableField" id="field4Value" contenteditable="true">0</span>
                    <span class="toggleableField" id="field5">a</span>
                    <span class="editable iNo toggleableField" id="field5Value" contenteditable="true">0</span>
                    <span class="toggleableField" id="field6">a</span>
                    <span class="editable iNo toggleableField" id="field6Value" contenteditable="true">0</span>`
            break;
        case 'Print':
            code = `<span class="editable iNo" contenteditable="true">"frog"</span>`
            break;
        case 'Format':
            code = `<span class="editable iNo" contenteditable="true">"frog"</span>`
            break;
        case 'Draw Flush':
            code = `<span>to</span>
                    <span class="editable blockControl" contenteditable="true">display1</span>`
            break;
        case 'Print Flush':
            code = `<span>to</span>
                    <span class="editable blockControl" contenteditable="true">message1</span>`
            break;
        case 'Get Link':
            code = `<span class="editable blockControl" contenteditable="true">result</span>
                    <span>= link#</span>
                    <span class="editable blockControl" contenteditable="true">0</span>`
            break;
        case 'Control':
            code = `<span>set</span>
                    <span class="editable blockControl" contenteditable="true" onclick="popUpMenu(event,'controlMenu')">enabled</span>
                    <span id="field1">of</span>
                    <span class="editable blockControl" id="field1Value" contenteditable="true">block1</span>
                    <span class="toggleableField" id="field2" style=display:block;>to</span>
                    <span class="editable blockControl toggleableField" id="field2Value" contenteditable="true" style=display:block;>0</span>
                    <span class="toggleableField" id="field3">y</span>
                    <span class="editable blockControl toggleableField" id="field3Value" contenteditable="true">0</span>
                    <span class="toggleableField" id="field4">to</span>
                    <span class="editable blockControl toggleableField" id="field4Value" contenteditable="true">0</span>`
            break;
        case 'Radar':
            code = `<span>from</span>
                    <span class="editable blockControl" contenteditable="true" id="field1Value">turret1</span>
                    <span>target</span>
                    <span class="editable blockControl" contenteditable="true" id="field2Value" onclick="popUpMenu(event,'radarMenuTarget')">enemy</span>
                    <span>and</span>
                    <span class="editable blockControl" contenteditable="true" id="field3Value" onclick="popUpMenu(event,'radarMenuTarget')">any</span>
                    <span>and</span>
                    <span class="editable blockControl" contenteditable="true" id="field4Value" onclick="popUpMenu(event,'radarMenuTarget')">any</span>
                    <span>order</span>
                    <span class="editable blockControl" contenteditable="true" id="field5Value">1</span>
                    <span>sort</span>
                    <span class="editable blockControl" contenteditable="true" id="field6Value" onclick="popUpMenu(event,'radarMenuSort')">distance</span>
                    <span>output</span>
                    <span class="editable blockControl" contenteditable="true" id="field7Value">result</span>`
            break;
        case 'Sensor':
            code = `<span class="editable blockControl" contenteditable="true">result</span>
                    <span>=</span>
                    <span class="editable blockControl dontInclude" contenteditable="true">@copper</span>
                    <img src="pencil.png" alt="" onclick="popUpMenu(event,'sensorMenu')" class="pencilMenu">
                    <span>in</span>
                    <span class="editable blockControl" contenteditable="true">block1</span>`
            break;
        case 'Set':
            code = `<span class="editable operation" contenteditable="true">result</span>
                    <span>=</span>
                    <span class="editable operation" contenteditable="true">a</span>`
            break;
        case 'Operation':
            code = `<span class="editable operation" contenteditable="true">result</span>
                    <span>=</span>
                    <span class="editable operation" contenteditable="true">a</span>
                    <span class="editable operation dontInclude" onclick="popUpMenu(event,'opMenu')">*</span>
                    <span class="editable operation" contenteditable="true">b</span>`
            break;
        case 'Lookup':
            code = `<span class="editable operation" contenteditable="true">result</span>
                    <span>=</span>
                    <span>lookup</span>
                    <span class="editable operation" contenteditable="true" onclick="popUpMenu(event,'lookupMenu')">item</span>
                    <span>#</span>
                    <span class="editable operation" contenteditable="true">0</span>`

            break;
        case 'Pack Color':
            code = `<span class="editable operation" contenteditable="true">result</span>
                    <span>=</span>
                    <span>pack</span>
                    <span class="editable operation" contenteditable="true">1</span>
                    <span class="editable operation" contenteditable="true">0</span>
                    <span class="editable operation" contenteditable="true">0</span>
                    <span class="editable operation" contenteditable="true">1</span>`
            break;
        case 'Wait':
            code = `<span class="editable flowControl" contenteditable="true">result</span>
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
                    <span class="editable flowControl toggleableField" id="field2Value" contenteditable="true" style=display:block;>x</span>
                    <span class="editable flowControl dontInclude" id="field3Value" onclick="popUpMenu(event,'jumpMenu')">not</span>
                    <span class="editable flowControl toggleableField" id="field4Value" contenteditable="true" style=display:block;>false</span>
                    <div class="jumpTo">
                        <span>Jump To</span>
                        <span class="editable flowControl dontInclude" id="field1Value" contenteditable="true" draggable="false">-1</span>
                    </div>
                    <canvas class="jumpArrow" width=60></canvas>
                    <img src="triangle.png" alt="" class="jumpArrowTriangle" draggable="false">`
            break;
        case 'Unit Bind':
            code = `<span>type</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'ubindMenu')">@poly</span>`
            break;
        case 'Unit Control':
            code = `<span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'ucontrolMenu')">move</span>
                    <span class="toggleableField" id="field1" style=display:block;>x</span>
                    <span class="editable unitControl toggleableField" id="field1Value" contenteditable="true" style=display:block;>0</span>
                    <span class="toggleableField" id="field2" style=display:block;>y</span>
                    <span class="editable unitControl toggleableField" id="field2Value" contenteditable="true" style=display:block;>0</span>
                    <span class="toggleableField" id="field3">x</span>
                    <span class="editable unitControl toggleableField" id="field3Value" contenteditable="true">0</span>
                    <span class="toggleableField" id="field4">y</span>
                    <span class="editable unitControl toggleableField" id="field4Value" contenteditable="true">0</span>
                    <span class="toggleableField" id="field5">y</span>
                    <span class="editable unitControl toggleableField" id="field5Value" contenteditable="true">0</span>`
            break;
        case 'Unit Radar':
            code = `<span>target</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'radarMenuTarget')">enemy</span>
                    <span>and</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'radarMenuTarget')">any</span>
                    <span>and</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'radarMenuTarget')">any</span>
                    <span>order</span>
                    <span class="editable unitControl" contenteditable="true">1</span>
                    <span>sort</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'radarMenuSort')">distance</span>
                    <span>output</span>
                    <span class="editable unitControl" contenteditable="true">result</span>`
            break;
        case 'Unit Locate':
            code = `<span>find</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'ulocateFindMenu')">building</span>
                    <span>group</span>
                    <span class="editable unitControl" contenteditable="true" onclick="popUpMenu(event,'ulocateGroupMenu')">core</span>
                    <span>enemy</span>
                    <span class="editable unitControl" contenteditable="true">true</span>
                    <span>outX</span>
                    <span class="editable unitControl" contenteditable="true">outx</span>
                    <span>outY</span>
                    <span class="editable unitControl" contenteditable="true">outy</span>
                    <span>found</span>
                    <span class="editable unitControl" contenteditable="true">found</span>
                    <span>building</span>
                    <span class="editable unitControl" contenteditable="true">building</span>`
            break;
        default:
            code = `<span>if you see this that means something went 
                    wrong, refresh or contact me</span>`
    }
    
    if (document.querySelector('.container')){
        containers = document.querySelectorAll('.container')
    }else {
        containers = document.querySelectorAll('.placeHolder')
    }
    const lastContainer = containers[containers.length - 1];
    lastContainer.insertAdjacentHTML('afterend', `
        <div class="container">
            <div class="${type}-container">
                <div class="block-header">
                    <span class="headerText">${buttonText}</span>
                    <div class="controls">
                        <span id="lineNumber">1</span>
                        <span onclick="copy(event)">⚪</span>
                        <span onclick="Delete(event)">✕</span>
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
    updateLineNumber();

    };

//count and update line number on instruction

function updateLineNumber() {
    let jumpIns = [];
    containers = document.querySelectorAll('.container');
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
    updateJumpArrow(jumpIns)
    // console.log(jumpIns);
}

    // JUMP ARROW VISUAL (WIP)
function updateJumpArrow(jumpIns) {
    jumpIns.forEach(jump => {
        const canvas = jump.querySelector('.jumpArrow');
        // console.log(canvas);

        const ctx = canvas.getContext('2d');
        const containerrRect = (jump.closest('.container')).getBoundingClientRect();
        const destinations = document.querySelectorAll('#lineNumber');
        let destinationTarget; 
        destinations.forEach(destination => {
            if (destination.textContent == (jump.querySelector('#field1Value')).textContent) {
                destinationTarget = destination.closest('.container')
            }
        })
        const desRect = destinationTarget?.getBoundingClientRect(); 
        let distance = (containerrRect.top + containerrRect.height / 2) - (desRect?.top + desRect?.height / 2)
        const containerrY = containerrRect.height / 3; 
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
        ctx.lineWidth = 5
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

function closeWizard() {
    document.getElementById('wizardMenu').style.display = 'none';
}

function openWizard() {
    document.getElementById('wizardMenu').style.display = 'flex';
}

// keybinds
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
    'p': 'Unit Bind',
    'o': 'Unit Control',
    'i': 'Unit Radar',
    'u': 'Unit Locate',
}
document.addEventListener('keydown',(e) =>{
    const wizardMenu = document.getElementById('wizardMenu');
    const isVisible = wizardMenu.style.display === 'flex';
    if (e.key === 'Escape' || (isVisible && e.key === 'F2')) {
        closeWizard();
        // console.log('work');
    }else if (e.key === 'F2' && !isVisible) {
        // console.log('work1');
        openWizard();
    }else if (isVisible) {
        if (keybindMap[e.key]){
            addInstruction(keybindMap[e.key])
        }
    }
})


// drag event
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
    (document.getElementById('debugText2')).textContent = isDragging;
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
        
        (document.getElementById('debugText8')).textContent = closestContainer?.textContent;
        let preview = closestContainer.nextSibling
        if (preview.className !== 'placementPreview'){
            (document.querySelector('.placementPreview'))?.remove();
            closestContainer.insertAdjacentHTML('afterend', `<div class="placementPreview" style=height:${(elementDragged.offsetHeight-40)}px;></div>`)
        }

        (document.getElementById('debugText6')).textContent = x;
        (document.getElementById('debugText7')).textContent = y;
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
        ctx.lineWidth = 5

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
            elementDragged.style.zIndex = '0';
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
                    if (elemen.className == 'container'){
                        element = elemen
                        break;
                    }
                }
                const container = element?.closest('.container')
                lineNumberElement = container?.querySelector('#lineNumber')
                lineNumber = lineNumberElement?.textContent
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

var clickedMenu;
var bgclickedMenu;
var popUpMenuElement;
var performanceStart;
var performanceEnd;
function popUpMenu(event,id){

    popUpMenuElement = document.getElementById(id);

    // console.log(sensorMenu)
    bgclickedMenu = popUpMenuElement.parentElement
    popUpMenuElement.style.display = 'block';
    bgclickedMenu.style.display = 'flex'
    clickedMenu = event.target;
    // Position the menu where the span was clicked
    const menuWidth = popUpMenuElement.offsetWidth;
    const menuHeight = popUpMenuElement.offsetHeight;
    // console.log(menuWidth)
    // console.log(menuHeight)

    // Calculate the position so the menu opens in the middle of the cursor
    const posX = event.clientX //+ window.scrollX;
    const posY = event.clientY //+ window.scrollY;

    // Set the menu's position with adjustments to center it
    popUpMenuElement.style.top = `${posY - menuHeight / 2}px`;
    popUpMenuElement.style.left = `${posX - menuWidth / 2}px`;
    // console.log("kajshdg")

    if (!popUpMenuElement.hasClick) {
        popUpMenuElement.addEventListener('click', function(event) {
            selectOption(event,id); 
        });
        popUpMenuElement.hasClick = true;
    }
}

const clickHandler = (event) => popUpMenu(event, 'drawMenuAlign');
function selectOption(event,id) {
    performanceStart = performance.now();
    let span;
    if (clickedMenu.tagName == 'IMG'){
        span = clickedMenu.previousElementSibling
    } else {
        span = clickedMenu
    }
    const option = event.target.textContent
    let targetId = event.target.id
    span.textContent = option;

    const fields = clickedMenu.parentElement.querySelectorAll('.toggleableField')

    // Draw instruction related function
    function rbgaFieldText(field) {
        // if (['field1', 'field1Value', 'field2', 'field2Value', 'field3', 'field3Value', 'field4', 'field4Value'].includes(field.id)){
            switch (field.id){
                case 'field1':
                    field.textContent = 'r'
                    break;
                case 'field2':
                    field.textContent = 'g'
                    break;
                case 'field3':
                    field.textContent = 'b'
                    break;
                case 'field4':
                    field.textContent = 'a'
                    break;}}
    function removeField3Event(field) {
        field.hasEvent = false;
        field.removeEventListener('click', clickHandler);
    }
    if (id == "drawMenu" && option != "print") {
        removeField3Event((clickedMenu.parentElement.querySelector('#field3Value')));
    }

    // Switch case for every pop up menu context that changes its instruction fields 
    //(there might be a better way but unless its performance is not >10ms its fine)
    switch (option){
        case 'enabled':
        case 'config':
            fields.forEach(field => {
                if (['field2', 'field2Value'].includes(field.id)){
                    switch (field.id){
                        case 'field2':
                            field.textContent = "to"
                    }
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'shoot':
            fields.forEach(field => {
                if (['field2', 'field2Value', 
                    'field3', 'field3Value', 
                    'field4', 'field4Value'].includes(field.id)){
                    switch (field.id){
                        case 'field2':
                            field.textContent = "x"
                            break;
                        case 'field3':
                            field.textContent = "y"
                            break;
                        case 'field4':
                            field.textContent = "shoot"
                    }
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'shootp':
            fields.forEach(field => {
                if (['field2', 'field2Value', 
                    'field3', 'field3Value',].includes(field.id)){
                    switch (field.id){
                        case 'field2':
                            field.textContent = "unit"
                            break;
                        case 'field3':
                            field.textContent = "shoot"
                            break;
                    }
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'clear':
            fields.forEach(field => {
                if (['field1', 'field2', 
                    'field3', 'field1Value', 
                    'field2Value', 'field3Value'].includes(field.id)){
                    rbgaFieldText(field);
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'color':
            // Since there are 2 'color'
            if (targetId) {
                switch (targetId){
                    case 'controlColor':
                        fields.forEach(field => {
                            if (['field2', 'field2Value'].includes(field.id)){
                                switch (field.id){
                                    case 'field2':
                                        field.textContent = "to"
                                }
                                field.style.display = 'block';
                            } else {
                                field.style.display = 'none';
                            }
                        })
                        break;
                    case 'drawColor':
                    fields.forEach(field => {
                        if (['field1', 'field2', 
                            'field3', 'field4', 
                            'field1Value', 'field2Value', 
                            'field3Value', 'field4Value'].includes(field.id)){
                            rbgaFieldText(field);
                            field.style.display = 'block';
                        } else {
                            field.style.display = 'none';
                        }
                    })
                }
            }
            break;
        case 'col':
            fields.forEach(field => {
                if (['field1', 'field1Value'].includes(field.id)){
                    if (field.id == 'field1'){
                        field.textContent = 'color'
                    }
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'stroke':
            fields.forEach(field => {
                if (['field1Value'].includes(field.id)){
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'line':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value', 
                    'field4', 'field4Value'].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'x2'
                            break;
                        case 'field4':
                            field.textContent = 'y2'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'rect':
        case 'lineRect':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value', 
                    'field4', 'field4Value'].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'width'
                            break;
                        case 'field4':
                            field.textContent = 'height'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'poly':
        case 'linePoly':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value', 
                    'field4', 'field4Value', 
                    'field5', 'field5Value'].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'sides'
                            break;
                        case 'field4':
                            field.textContent = 'radius'
                            break;
                        case 'field5':
                            field.textContent = 'rotation'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'triangle':
            fields.forEach(field => {
                if (field.id){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'x2'
                            break;
                        case 'field4':
                            field.textContent = 'y2'
                            break;
                        case 'field5':
                            field.textContent = 'x3'
                            break;
                        case 'field6':
                            field.textContent = 'y3'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'image':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value', 
                    'field4', 'field4Value', 
                    'field5', 'field5Value'].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'image'
                            break;
                        case 'field4':
                            field.textContent = 'size'
                            break;
                        case 'field5':
                            field.textContent = 'rotation'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'print':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value'].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'align'
                            break;
                        case 'field3Value':
                            field.textContent = "center"
                            if (!(field.hasEvent)){
                                field.hasEvent = true
                                field.addEventListener('click', clickHandler);
                            }
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'translate':
        case 'scale':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value'].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'rotate':
            fields.forEach(field => {
                if (['field1', 'field1Value'].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'degrees'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;

        // Unit control section
        case 'reset':
        case 'idle':
        case 'stop':
        case 'autoPathfind':
        case 'payDrop':
        case 'payEnter':
        case 'unbind':
            fields.forEach(field => {
                field.style.display = 'none';
            })
            break;
        case 'move':
        case 'pathfind':
        case 'mine':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'approach':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'radius'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'boost':
            fields.forEach(field => {
                if (['field1', 'field1Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'enable'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'target':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'shoot'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'targetp':
        fields.forEach(field => {
            if (['field1', 'field1Value', 
                'field2', 'field2Value',].includes(field.id)){
                switch (field.id){
                    case 'field1':
                        field.textContent = 'unit'
                        break;
                    case 'field2':
                        field.textContent = 'shoot'
                        break;
                } 
                field.style.display = 'block';
            } else {
                field.style.display = 'none';
            }
        })
        break;
        case 'itemDrop':
        fields.forEach(field => {
            if (['field1', 'field1Value', 
                'field2', 'field2Value',].includes(field.id)){
                switch (field.id){
                    case 'field1':
                        field.textContent = 'to'
                        break;
                    case 'field2':
                        field.textContent = 'amount'
                        break;
                } 
                field.style.display = 'block';
            } else {
                field.style.display = 'none';
            }
        })
        break;
        case 'itemTake':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value',
                    'field3', 'field3Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'from'
                            break;
                        case 'field2':
                            field.textContent = 'item'
                            break;
                        case 'field3':
                            field.textContent = 'amount'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'payTake':
            fields.forEach(field => {
                if (['field1', 'field1Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'takeUnits'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'itemTake':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value',
                    'field3', 'field3Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'from'
                            break;
                        case 'field2':
                            field.textContent = 'item'
                            break;
                        case 'field3':
                            field.textContent = 'amount'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'flag':
        fields.forEach(field => {
            if (['field1', 'field1Value',].includes(field.id)){
                switch (field.id){
                    case 'field1':
                        field.textContent = 'value'
                        break;
                } 
                field.style.display = 'block';
            } else {
                field.style.display = 'none';
            }
        })
        break;
        case 'build':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value',
                    'field3', 'field3Value',
                    'field4', 'field4Value',
                    'field5', 'field5Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'block'
                            break;
                        case 'field4':
                            field.textContent = 'rotation'
                            break;
                        case 'field5':
                            field.textContent = 'config'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'getBlock':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value',
                    'field3', 'field3Value',
                    'field4', 'field4Value',
                    'field5', 'field5Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'type'
                            break;
                        case 'field4':
                            field.textContent = 'building'
                            break;
                        case 'field5':
                            field.textContent = 'floor'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'within':
            fields.forEach(field => {
                if (['field1', 'field1Value', 
                    'field2', 'field2Value', 
                    'field3', 'field3Value',
                    'field4', 'field4Value',].includes(field.id)){
                    switch (field.id){
                        case 'field1':
                            field.textContent = 'x'
                            break;
                        case 'field2':
                            field.textContent = 'y'
                            break;
                        case 'field3':
                            field.textContent = 'radius'
                            break;
                        case 'field4':
                            field.textContent = 'result'
                            break;
                    } 
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
        case 'always':
            fields.forEach(field => {
                if (['field1Value', 
                    'field2Value',
                    'field3Value',
                    'field4Value',].includes(field.id)){
                    field.style.display = 'none';
                } else {
                    field.style.display = 'block';
                }
            })
            break;
        case '==':
        case 'not':
        case '<':
        case '<=':
        case '>':
        case '>=':
        case '===':
            fields.forEach(field => {
                if (['field2Value', 
                    'field3Value',
                    'field4Value',].includes(field.id)){
                    field.style.display = 'block';
                } else {
                    field.style.display = 'none';
                }
            })
            break;
    }
    closeMenu(event);
}

function closeMenu(event) {
    popUpMenuElement.style.display = 'none';
    event.stopPropagation();
    bgclickedMenu.style.display = 'none'
    performanceEnd = performance.now();
    (document.getElementById('debugText4')).textContent = (`Execution time: ${performanceEnd - performanceStart} milliseconds`);
    console.log(`Execution time: ${performanceEnd - performanceStart} milliseconds`);
}


const operatorMap = {
    "+"         : 'add ',
    "-"         : 'sub ',
    "*"         : 'mul ',
    "/"         : 'div ',
    "//"        : 'idiv ',
    "%"         : 'mod ',
    "^"         : 'pow ',
    "=="        : 'equal ',
    "not"       : 'notEqual ',
    "and"       : 'land ',
    "<"         : 'lessThan ',
    "<="        : 'lessThanEqual ',
    ">"         : 'greaterThan ',
    ">="        : 'greaterThanEqua ',
    "==="       : 'strictEqual ',
    "<<"        : 'shl ',
    ">>"        : 'shr ',
    "or"        : 'or ',
    "b-and"     : 'and ',
    "xor"       : 'xor ',
    "flip"      : 'not ',
    "max"       : 'max ',
    "min"       : 'min ',
    "angle"     : 'angle ',
    "anglediff" : 'angleDiff ',
    "len"       : 'len ',
    "noise"     : 'noise ',
    "abs"       : 'abs ',
    "log"       : 'log ',
    "log10"     : 'log10 ',
    "floor"     : 'floor ',
    "ceil"      : 'ceil ',
    "sqrt"      : 'sqrt ',
    "rand"      : 'rand ',
    "sin"       : 'sin ',
    "cos"       : 'cos ',
    "tan"       : 'tan ',
    "asin"      : 'asin ',
    "acos"      : 'acos ',
    "atan"      : 'atan ',
    "always"      : 'always '
};

let instTypeMap = {
    'Read'          : 'read ',
    'Write'         : 'write ',
    'Draw'          : 'draw ',
    'Print'         : 'print ',
    'Format'        : 'format ',
    'Draw Flush'    : 'drawflush ',
    'Print Flush'   : 'printflush ',
    'Get Link'      : 'getlink ',
    'Control'       : 'control ',
    'Sensor'        : 'sensor ',
    'Set'           : 'set ',
    'Lookup'        : 'lookup ',
    'Pack Color'    : 'packcolor ',
    'Wait'          : 'wait ',
    'Stop'          : 'stop ',
    'End'           : 'end ',
    'Unit Bind'     : 'ubind ',
    'Unit Control'  : 'ucontrol ',
    'Unit Radar'    : 'uradar ',
    'Unit Locate'   : 'ulocate ',
} 
function exportCode(){
    codeEx = ""
    containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        insSpan = container.querySelector('span');
        if (insSpan){
            codeEx += '\n'
            let instType = insSpan.textContent;
            if (instTypeMap?.[instType]){
                codeEx += instTypeMap[instType];
                exportFields()
            } else {
                if (instType == 'Jump'){
                    codeEx += `jump ${container.querySelector('#field1Value')?.textContent} ${operatorMap[container.querySelector('#field3Value')?.textContent]}`
                }
                if (instType == 'Operation'){
                    codeEx += "op "
                    operator = container.querySelector('.dontInclude')
                    OperatorString = (operator.textContent.replace(/\s+/g, ''));
                    if (operatorMap[OperatorString] !== undefined) {
                        codeEx += operatorMap[OperatorString];
                    }
                    exportFields()
                }
                if (instType == 'Radar'){
                    codeEx += `radar ${container.querySelector('#field2Value')?.textContent} ${container.querySelector('#field3Value')?.textContent} ${container.querySelector('#field4Value')?.textContent} ${container.querySelector('#field6Value')?.textContent} ${container.querySelector('#field1Value')?.textContent} ${container.querySelector('#field5Value')?.textContent} ${container.querySelector('#field7Value')?.textContent}`
                }
            }
            function exportFields(){
                codeElements = container.querySelectorAll('span');
                codeElements.forEach(code => {
                    if (code.classList.contains('editable') && !code.classList.contains('dontInclude') && (getComputedStyle(code)).display === 'block'){
                        codeEx += (code.textContent.replace(/\s+/g, '') + ' ');
                    }
                });
            }
        };
    });
    navigator.clipboard.writeText(codeEx)
    document.getElementById('alert').classList.remove("alertShow")
    document.getElementById('alert').style.display = 'block'
    setTimeout(() => {
        document.getElementById('alert').classList.add("alertShow");
        setTimeout(() => {
            document.getElementById('alert').style.display = 'none'
        }, 1000);
    }, 1000);
    // localStorage.setItem('key1', 'value1');
}


// const value = localStorage.getItem('key1');
// console.log(value);
// console.log('asdlkgjasdg');


window.onload = () => {
    document.getElementById('loadingAlert').style.display = 'none'
}