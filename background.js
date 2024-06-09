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
  