// Function to update line numbers
function updateLineNumbers(element, lineNumbersElement) {
    const lines = element.value ? element.value.split('\n').length : 1;
    let lineNumbersHtml = '';
    
    for (let i = 1; i <= lines; i++) {
        lineNumbersHtml += `<span>${i}</span>`;
    }
    
    lineNumbersElement.innerHTML = lineNumbersHtml;
}

// Function to update output line numbers
function updateOutputLineNumbers(element, lineNumbersElement) {
    // Get the actual number of lines after wrapping
    const text = element.textContent || '';
    const lines = text.split('\n').length;
    
    // Calculate additional wrapped lines
    const elementWidth = element.clientWidth - 50; // Account for padding
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'pre-wrap';
    tempSpan.style.wordBreak = 'break-word';
    tempSpan.style.width = elementWidth + 'px';
    tempSpan.style.font = window.getComputedStyle(element).font;
    document.body.appendChild(tempSpan);
    
    let wrappedLines = 0;
    text.split('\n').forEach(line => {
        tempSpan.textContent = line;
        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
        const lineCount = Math.ceil(tempSpan.offsetHeight / lineHeight);
        wrappedLines += lineCount;
    });
    
    document.body.removeChild(tempSpan);
    
    // Generate line numbers
    let lineNumbersHtml = '';
    for (let i = 1; i <= wrappedLines; i++) {
        lineNumbersHtml += `<span>${i}</span>`;
    }
    
    lineNumbersElement.innerHTML = lineNumbersHtml;
}

// Function to generate a UUID v4
function generateUUIDv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Function to format UUID based on options
function formatUUID(uuid, uppercase, includeHyphens) {
    let formatted = uuid;
    if (!includeHyphens) {
        formatted = formatted.replace(/-/g, '');
    }
    if (uppercase) {
        formatted = formatted.toUpperCase();
    }
    return formatted;
}

// Function to generate single or multiple UUIDs
function generateUUIDs(count = 1) {
    const output = document.getElementById('uuid-output');
    const uppercase = document.getElementById('uppercase-uuid').checked;
    const hyphens = document.getElementById('hyphens-uuid').checked;
    
    let uuids = [];
    for (let i = 0; i < count; i++) {
        const uuid = generateUUIDv4();
        uuids.push(formatUUID(uuid, uppercase, hyphens));
    }
    
    output.textContent = uuids.join('\n');
}

// Function to copy text to clipboard
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        button.classList.add('copied');
        const originalText = button.textContent;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
            `;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

// JSON Formatter Functions
function beautifyJSON() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const outputLineNumbers = document.getElementById('output-line-numbers');
    
    try {
        const parsed = JSON.parse(input.value);
        const formatted = JSON.stringify(parsed, null, 2);
        output.textContent = formatted;
        output.classList.remove('error');
        updateOutputLineNumbers(output, outputLineNumbers);
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
        output.classList.add('error');
        updateOutputLineNumbers(output, outputLineNumbers);
    }
}

function uglifyJSON() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const outputLineNumbers = document.getElementById('output-line-numbers');
    
    try {
        const parsed = JSON.parse(input.value);
        const minified = JSON.stringify(parsed);
        output.textContent = minified;
        output.classList.remove('error');
        updateOutputLineNumbers(output, outputLineNumbers);
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
        output.classList.add('error');
        updateOutputLineNumbers(output, outputLineNumbers);
    }
}

// Password Generator Functions
function generatePassword() {
    const length = document.getElementById('password-length').value;
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeLowercase = document.getElementById('include-lowercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
    
    const output = document.getElementById('password-output');
    
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        output.textContent = 'Please select at least one character type';
        output.classList.add('error');
        return;
    }
    
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    
    output.textContent = password;
    output.classList.remove('error');
}

// Function to open a tool in fullscreen
function openTool(toolId) {
    const overlay = document.getElementById(`${toolId}-overlay`);
    overlay.classList.add('active');
    
    // Focus on the input field if it exists
    const input = document.getElementById(`${toolId}-input`);
    if (input) {
        input.focus();
    }
}

// Function to close a tool
function closeTool(toolId) {
    const overlay = document.getElementById(`${toolId}-overlay`);
    overlay.classList.remove('active');
}

// Initialize event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // JSON Formatter event listeners
    const beautifyBtn = document.getElementById('beautify-btn');
    const uglifyBtn = document.getElementById('uglify-btn');
    const jsonInput = document.getElementById('json-input');
    const inputLineNumbers = document.getElementById('input-line-numbers');
    const outputLineNumbers = document.getElementById('output-line-numbers');
    const jsonOutput = document.getElementById('json-output');
    
    if (beautifyBtn) {
        beautifyBtn.addEventListener('click', beautifyJSON);
    }
    
    if (uglifyBtn) {
        uglifyBtn.addEventListener('click', uglifyJSON);
    }
    
    if (jsonInput) {
        // Add input event listener for real-time formatting
        jsonInput.addEventListener('input', function() {
            // Update line numbers for input
            updateLineNumbers(jsonInput, inputLineNumbers);
            
            // Debounce the function to avoid excessive processing
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                beautifyJSON();
            }, 300); // 300ms delay
        });
        
        // Initialize line numbers
        updateLineNumbers(jsonInput, inputLineNumbers);
    }
    
    if (jsonOutput) {
        // Initialize output line numbers
        updateOutputLineNumbers(jsonOutput, outputLineNumbers);
    }
    
    // Password Generator event listeners
    const generatePasswordBtn = document.getElementById('generate-password-btn');
    
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', generatePassword);
    }
    
    // UUID Generator event listeners
    const generateUuidBtn = document.getElementById('generate-uuid-btn');
    const generateMultipleUuidBtn = document.getElementById('generate-multiple-uuid-btn');
    const uppercaseUuid = document.getElementById('uppercase-uuid');
    const hyphensUuid = document.getElementById('hyphens-uuid');
    
    if (generateUuidBtn) {
        generateUuidBtn.addEventListener('click', () => generateUUIDs(1));
    }
    
    if (generateMultipleUuidBtn) {
        generateMultipleUuidBtn.addEventListener('click', () => generateUUIDs(10));
    }
    
    // Format UUID when options change
    [uppercaseUuid, hyphensUuid].forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                const output = document.getElementById('uuid-output');
                if (output.textContent && output.textContent !== 'UUID will appear here') {
                    generateUUIDs(output.textContent.split('\n').length);
                }
            });
        }
    });
    
    // Copy button event listeners
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                copyToClipboard(targetElement.textContent, this);
            }
        });
    });
    
    // Tool card click event listeners
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolId = this.id.replace('-card', '');
            openTool(toolId);
        });
    });
    
    // Open tool button click event listeners
    const openToolBtns = document.querySelectorAll('.open-tool-btn');
    openToolBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const toolId = this.getAttribute('data-tool');
            openTool(toolId);
        });
    });
    
    // Close button click event listeners
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool');
            closeTool(toolId);
        });
    });
    
    // Close overlay when clicking outside the content
    const overlays = document.querySelectorAll('.fullscreen-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                const toolId = this.id.replace('-overlay', '');
                closeTool(toolId);
            }
        });
    });
    
    // Close overlay when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeOverlay = document.querySelector('.fullscreen-overlay.active');
            if (activeOverlay) {
                const toolId = activeOverlay.id.replace('-overlay', '');
                closeTool(toolId);
            }
        }
    });
});