const grayscaleButton = document.getElementById('grayscaleButton');
const resetButton = document.getElementById('resetButton');
const clearButton = document.getElementById('clear');
const eraserButton = document.getElementById('eraser');
const colorInput = document.getElementById('in-1');
const thicknessInput = document.getElementById('in-2');
const notesButton = document.getElementById('notes');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Section 1
canvas.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: injectCanvas
        }
    );
});

async function injectCanvas() {
    try {
        const canvas = document.createElement('canvas');
        canvas.id = "my-canvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.top = '0px';
        canvas.style.position = "absolute";
        canvas.style.zIndex = 999;

        const body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);

        // const style = document.createElement('style');
        // style.innerHTML = `
        //     canvas {
        //         border: 2px solid violet;
        //     }
        // `;
        // document.head.appendChild(style);

        const ctx = canvas.getContext("2d");
        let prevX = null;
        let prevY = null;
        ctx.lineWidth = 5;
        let draw = false;

        window.addEventListener("mousedown", () => draw = true);
        window.addEventListener("mouseup", () => draw = false);
        window.addEventListener('mousemove', (e) => {
            if (prevX == null || prevY == null || !draw) {
                prevX = e.clientX;
                prevY = e.clientY;
                return;
            }

            let currentX = e.clientX;
            let currentY = e.clientY;

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = window.currentColor || 'black';
            ctx.stroke();

            prevX = currentX;
            prevY = currentY;
        });
    } catch (err) {
        console.error(err);
    }
}

// Section 2
const pickers = Array.from(document.getElementsByClassName('clr'));

pickers.forEach(picker => {
    picker.addEventListener('click', async () => {
        console.log('hello');
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },
                function: setPickerColor,
                args: [picker.dataset.clr]
            }
        );
    });
});

async function setPickerColor(color) {
    try {
        window.currentColor = color;
        console.log('Current color set to:', window.currentColor);
    } catch (err) {
        console.error(err);
    }
}

// Section 3
// const c_arrow =document.getElementById('c_arrow')
// c_arrow.addEventListener('click', async () => {
//     console.log('hello');
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     chrome.scripting.executeScript(
//         {
//             target: { tabId: tab.id },
//             function: rightArrow,
//         }
//     );
// });

// async function rightArrow() {
//     try {
//         let canvas = document.getElementById('my-canvas');
//         const ctx = canvas.getContext("2d");
//         const image1 =document.getElementById('c_arrow')
//         ctx.drawImage(image1,10,10)
//     } catch (err) {
//         console.error(err);
//     }
// }

const notAvailable = document.getElementsByClassName('shp');

// Convert HTMLCollection to array and then add event listeners
Array.from(notAvailable).forEach(element => {
    element.addEventListener('click', () => {
        alert('Functionality Not Available');
    });
});


































// Section 4
notesButton.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: addNotes,
        }
    );
});



async function addNotes() {
    try {
        let canvas = document.getElementById('my-canvas');
        const ctx = canvas.getContext("2d");
        let mouseX = 0;
        let mouseY = 0;
        let startingX = 0;
        let capsLockActive = false;
        let shiftActive = false;

        // Make canvas focusable
        canvas.tabIndex = 1000;
        canvas.style.outline = "none";
        
        // Focus the canvas to capture keydown events
        canvas.focus();

        canvas.addEventListener("click", (e) => {
            console.log('called');
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            startingX = mouseX;
            return;
        });

        canvas.addEventListener("keydown", (e) => {
            console.log('keydown');
            if (e.key === "Backspace") {
                // Clear the area behind the text
                ctx.clearRect(mouseX - 10, mouseY - 20, 20, 30);
                mouseX -= ctx.measureText(e.key).width; // Move the cursor backward
            } else if (e.key === "Enter") {
                // Move to a new line
                mouseY += 20; // Assuming font size is 16px
                mouseX = startingX; // Reset X position to starting position
            } else if (e.key === "CapsLock") {
                // Toggle Caps Lock state
                capsLockActive = !capsLockActive;
            } else if (e.key === "Shift") {
                // Toggle Shift state
                shiftActive = true;
            } else {
                // Determine if the letter should be uppercase or lowercase
                const letter = shiftActive ? e.key.toUpperCase() : e.key.toLowerCase();
                ctx.font = '16px Arial';
                
                ctx.fillText(letter, mouseX, mouseY);
                mouseX += ctx.measureText(letter).width; // Move the cursor forward
            }
        });

        canvas.addEventListener("keyup", (e) => {
            // Reset Shift state when Shift key is released
            if (e.key === "Shift") {
                shiftActive = false;
            }
        });
    } catch (err) {
        console.error(err);
    }
}


clearButton.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: clear,
        }
    );
});

async function clear() {
    try {
        const canvas = document.getElementById('my-canvas');
        if (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        }
    } catch (err) {
        console.error(err);
    }
}

eraserButton.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: erase,
        }
    );
});

async function erase() {
    try {
        window.currentColor = 'white'; // Set to white for eraser effect
    } catch (err) {
        console.error(err);
    }
}

// Handle color input from color picker
colorInput.addEventListener('input', async () => {
    let colorValue = colorInput.value;
    console.log('Color value changed to:', colorValue);

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: cinput,
            args: [colorValue]
        }
    );
});

function cinput(colorValue) {
    try {
        window.currentColor = colorValue;
        console.log('Current color set to:', window.currentColor);
    } catch (err) {
        console.error(err);
    }
}

// Handle thickness input
thicknessInput.addEventListener('input', async () => {
    let thicknessValue = thicknessInput.value;
    console.log('Thickness value changed to:', thicknessValue);

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: tInput,
            args: [thicknessValue]
        }
    );
});

function tInput(thicknessValue) {
    try {
        const canvas = document.getElementById('my-canvas');
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = thicknessValue;
        console.log('Line width set to:', thicknessValue);
    } catch (err) {
        console.error(err);
    }
}



// Highlight Text
const textHighlighter= document.getElementById('selection')
textHighlighter.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: highlightText,
        }
    );
});

async function highlightText() {
    try {
        // Access the current selection
        let selection = window.getSelection();
        
        // Get the range of the first (and typically only) highlighted text
        let range = selection.getRangeAt(0);
        
        // Get the selected text
        let selectedText = range.toString();
        
        // Check if the selected text is already wrapped in a span
        let commonAncestor = range.commonAncestorContainer;
        let existingSpan = null;

        if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
            // If the common ancestor is an element, check if it has a span child
            existingSpan = commonAncestor.querySelector('span[style*="background-color"]');
        } else if (commonAncestor.nodeType === Node.TEXT_NODE) {
            // If the common ancestor is a text node, check its parent
            let parentElement = commonAncestor.parentElement;
            if (parentElement.tagName === 'SPAN' && parentElement.style.backgroundColor) {
                existingSpan = parentElement;
            }
        }

        if (existingSpan) {
            // If already highlighted, change the background color
            existingSpan.style.backgroundColor = window.currentColor;
        } else {
            // Create a new span and set its background color
            let span = document.createElement('span');
            span.style.backgroundColor = window.currentColor;
            range.surroundContents(span);
        }

    } catch (err) {
        console.error(err);
    }
}

// Example: Setting a color to use for highlighting
window.currentColor = 'yellow';





// Section 5
const imageButton = document.getElementById('image');

imageButton.addEventListener('click',  ()=>{
    chrome.tabs.captureVisibleTab(null,{ format: "png" }, (screenshotUrl) => {
           
        var link = document.createElement('a');
        
        link.download = "screenshot.png";
        link.href = screenshotUrl;
        link.click();
        
    });
}
);






grayscaleButton.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: convert
        }
    );
});

async function convert() {
    try {
        document.documentElement.style.filter = 'grayscale(100%)';
    } catch (err) {
        console.error(err);
    }
}

resetButton.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: reset
        }
    );
});

async function reset() {
    try {
        document.documentElement.style.filter = 'none';
        const canvas = document.getElementById('my-canvas');
        if (canvas) {
            canvas.remove();
        }
        var elements = document.getElementsByClassName('web-annotator-highlight');
        Array.from(elements).forEach(function(element) {
            element.remove();
        });
    } catch (err) {
        console.error(err);
    }
}



const nude = document.getElementById('nude');
nude.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: promptAndAddNote
        }
    );
});

async function promptAndAddNote() {
    try {
        let selection = window.getSelection();
        if (selection.rangeCount > 0) {
            let selectedText = selection.toString();
            if (selectedText.trim().length > 0) {
                let note = prompt("Enter a note for the selected text:");
                if (note) {
                    addNoteToSelection(selection, note);
                }
            } else {
                alert("Please select some text on the webpage first.");
            }
        } else {
            alert("Please select some text on the webpage first.");
        }
    } catch (err) {
        console.error(err);
    }
    
    function addNoteToSelection(selection, note) {
        try {
            let range = selection.getRangeAt(0);
            let span = document.createElement("span");
            span.style.backgroundColor = "#FFFF00"; 
            span.className = "web-annotator-highlight";
            span.style.fontSize = "20px";
            span.appendChild(document.createTextNode(note));
            let endNode = range.endContainer;
            let endOffset = range.endOffset;
            
            let afterNode = endNode.splitText(endOffset);
            let space = document.createTextNode(" ");
            afterNode.parentNode.insertBefore(space, afterNode);
            afterNode.parentNode.insertBefore(span, afterNode);
            selection.removeAllRanges();
        } catch (err) {
            console.error(err);
        }
    }
}

const savePdf =document.getElementById('pdf')
savePdf.addEventListener('click', async () => {
    console.log('hello');
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: saveasPDF
        }
    );
});

async function saveasPDF() {
    try {
        window.print();
    } catch (err) {
        console.error(err);
    }
}




// Shortcut
chrome.commands.onCommand.addListener(function(command) {
    if (command == "highlight-text") {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: highlightText,
        });
      });
    }
  });
  