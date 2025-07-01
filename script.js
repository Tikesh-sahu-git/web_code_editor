document.addEventListener('DOMContentLoaded', function() {
    // HTML tag suggestions
    const htmlTags = [
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th',
        'form', 'input', 'button', 'textarea', 'select', 'option',
        'header', 'footer', 'section', 'article', 'aside', 'nav',
        'main', 'figure', 'figcaption', 'time', 'mark', 'code',
        'pre', 'blockquote', 'iframe', 'video', 'audio', 'canvas'
    ];

    // HTML attribute suggestions
    const htmlAttributes = [
        'class', 'id', 'style', 'src', 'href', 'alt', 'title',
        'width', 'height', 'target', 'rel', 'type', 'value',
        'placeholder', 'required', 'disabled', 'checked', 'selected',
        'rows', 'cols', 'maxlength', 'min', 'max', 'step'
    ];

    // CSS property suggestions
    const cssProperties = [
        'color', 'background-color', 'font-size', 'font-family',
        'font-weight', 'text-align', 'margin', 'padding', 'border',
        'width', 'height', 'display', 'position', 'top', 'right',
        'bottom', 'left', 'flex', 'grid', 'justify-content',
        'align-items', 'background', 'border-radius', 'box-shadow',
        'opacity', 'transition', 'transform', 'animation', 'z-index'
    ];

    // CSS value suggestions
    const cssValues = [
        'red', 'blue', 'green', 'black', 'white', 'transparent',
        '12px', '14px', '16px', '1em', '1.2em', '100%', '50%',
        'block', 'inline', 'inline-block', 'flex', 'grid', 'none',
        'relative', 'absolute', 'fixed', 'sticky', 'center', 'left',
        'right', 'space-between', 'space-around', 'bold', 'normal',
        'italic', 'underline', 'uppercase', 'lowercase', 'capitalize'
    ];

    // JavaScript method suggestions
    const jsMethods = [
        'querySelector', 'querySelectorAll', 'addEventListener',
        'getElementById', 'getElementsByClassName', 'getElementsByTagName',
        'createElement', 'appendChild', 'removeChild', 'classList.add',
        'classList.remove', 'classList.toggle', 'setAttribute',
        'getAttribute', 'removeAttribute', 'innerHTML', 'textContent',
        'value', 'style', 'setTimeout', 'setInterval', 'clearTimeout',
        'clearInterval', 'parseInt', 'parseFloat', 'toString',
        'toFixed', 'split', 'join', 'push', 'pop', 'shift', 'unshift',
        'slice', 'splice', 'indexOf', 'includes', 'forEach', 'map',
        'filter', 'reduce', 'find', 'some', 'every', 'sort', 'reverse'
    ];

    // Elements
    const htmlEditor = document.getElementById('html-code');
    const cssEditor = document.getElementById('css-code');
    const jsEditor = document.getElementById('js-code');
    const previewFrame = document.getElementById('preview-frame');
    const runBtn = document.getElementById('run-code');
    const downloadBtn = document.getElementById('download-code');
    const clearBtn = document.getElementById('clear-code');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const editorSections = document.querySelectorAll('.editor-section');
    const htmlElement = document.documentElement;
    
    // Initialize editors with line numbers
    initEditor(htmlEditor);
    initEditor(cssEditor);
    initEditor(jsEditor);
    
    // Theme management
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    
    // Initial code run
    updatePreview();
    
    // Event listeners
    runBtn.addEventListener('click', updatePreview);
    downloadBtn.addEventListener('click', exportCode);
    clearBtn.addEventListener('click', clearEditors);
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Auto-run when code changes (with debounce)
    let debounceTimer;
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('input', () => {
            updateLineNumbers(editor);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updatePreview, 1000);
        });
        
        // Add suggestions on keypress
        editor.addEventListener('keydown', function(e) {
            handleKeyDown(e, editor);
        });
    });
    
    // Functions
    function initEditor(editor) {
        const wrapper = document.createElement('div');
        wrapper.className = 'editor-wrapper';
        editor.parentNode.insertBefore(wrapper, editor);
        wrapper.appendChild(editor);
        
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        wrapper.insertBefore(lineNumbers, editor);
        
        editor.classList.add('code-input');
        updateLineNumbers(editor);
        
        // Create suggestions container
        const suggestions = document.createElement('div');
        suggestions.className = 'suggestions-container';
        wrapper.appendChild(suggestions);
    }
    
    function updateLineNumbers(editor) {
        const lineNumbers = editor.previousElementSibling;
        const lines = editor.value.split('\n');
        lineNumbers.innerHTML = '';
        
        for (let i = 0; i < lines.length; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.textContent = i + 1;
            lineNumbers.appendChild(lineNumber);
        }
    }
    
    function updatePreview() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        
        const doc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${css}</style>
            </head>
            <body>${html}
                <script>${js}</script>
            </body>
            </html>
        `;
        
        previewFrame.srcdoc = doc;
    }
    
    function exportCode() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        
        const fullCode = `<!DOCTYPE html>
<html>
<head>
    <title>Exported Page</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${js}
    </script>
</body>
</html>`;
        
        const blob = new Blob([fullCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webpage.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function clearEditors() {
        if (confirm('Are you sure you want to clear all editors?')) {
            htmlEditor.value = '';
            cssEditor.value = '';
            jsEditor.value = '';
            updateLineNumbers(htmlEditor);
            updateLineNumbers(cssEditor);
            updateLineNumbers(jsEditor);
            updatePreview();
        }
    }
    
    function toggleTheme() {
        const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            htmlElement.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }
    
    function switchTab(tabName) {
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        editorSections.forEach(section => {
            section.classList.toggle('active', section.id === `${tabName}-editor`);
        });
    }
    
    function handleKeyDown(e, editor) {
        const suggestions = editor.parentNode.querySelector('.suggestions-container');
        
        // If suggestions are visible, handle arrow keys and enter
        if (suggestions.style.display === 'block') {
            const active = suggestions.querySelector('.active');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = active ? active.nextElementSibling : suggestions.firstElementChild;
                if (next) {
                    if (active) active.classList.remove('active');
                    next.classList.add('active');
                }
                return;
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = active ? active.previousElementSibling : suggestions.lastElementChild;
                if (prev) {
                    if (active) active.classList.remove('active');
                    prev.classList.add('active');
                }
                return;
            }
            
            if (e.key === 'Enter' && active) {
                e.preventDefault();
                insertSuggestion(editor, active.textContent);
                suggestions.style.display = 'none';
                return;
            }
            
            if (e.key === 'Escape') {
                suggestions.style.display = 'none';
                return;
            }
        }
        
        // Show suggestions based on trigger characters
        if (e.key === '<' || e.key === '.' || 
            (editor === cssEditor && e.key === ':') || 
            (editor === jsEditor && e.key === '.')) {
            setTimeout(() => {
                showSuggestions(editor, e.key);
            }, 10);
        }
    }
    
    function showSuggestions(editor, triggerChar) {
        const cursorPos = editor.selectionStart;
        const textBeforeCursor = editor.value.substring(0, cursorPos);
        
        const suggestions = editor.parentNode.querySelector('.suggestions-container');
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        
        let suggestionsList = [];
        const language = editor === htmlEditor ? 'html' : 
                        editor === cssEditor ? 'css' : 'javascript';
        
        // Get suggestions based on language and context
        if (language === 'html') {
            suggestionsList = getHtmlSuggestions(textBeforeCursor, triggerChar);
        } else if (language === 'css') {
            suggestionsList = getCssSuggestions(textBeforeCursor, triggerChar);
        } else {
            suggestionsList = getJsSuggestions(textBeforeCursor, triggerChar);
        }
        
        if (suggestionsList.length > 0) {
            suggestionsList.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = item;
                div.addEventListener('click', () => {
                    insertSuggestion(editor, item);
                    suggestions.style.display = 'none';
                });
                suggestions.appendChild(div);
            });
            
            // Position the suggestions dropdown
            const lineHeight = parseInt(getComputedStyle(editor).lineHeight);
            const lines = textBeforeCursor.split('\n');
            const currentLine = lines[lines.length - 1];
            const lineNum = lines.length;
            const charPos = currentLine.length;
            
            suggestions.style.top = `${(lineNum * lineHeight) + 5}px`;
            suggestions.style.left = `${(charPos * 8) + 50}px`;
            suggestions.style.display = 'block';
            suggestions.firstElementChild.classList.add('active');
        }
    }
    
    function getHtmlSuggestions(textBeforeCursor, triggerChar) {
        if (triggerChar === '<') {
            return htmlTags.map(tag => `${tag}>`);
        }
        
        if (triggerChar === ' ') {
            const tagMatch = textBeforeCursor.match(/<([a-zA-Z]+)/);
            if (tagMatch) {
                return htmlAttributes.map(attr => `${attr}=""`);
            }
        }
        
        return [];
    }
    
    function getCssSuggestions(textBeforeCursor, triggerChar) {
        if (triggerChar === ':') {
            const propertyMatch = textBeforeCursor.match(/([a-zA-Z-]+)\s*:/);
            if (propertyMatch) {
                return cssValues;
            }
            return [];
        }
        
        // Check if we're in a selector context
        if (triggerChar === ' ' && !textBeforeCursor.trim().endsWith('{')) {
            return cssProperties.map(prop => `${prop}: `);
        }
        
        return [];
    }
    
    function getJsSuggestions(textBeforeCursor, triggerChar) {
        if (triggerChar === '.') {
            // Get the variable/object before the dot
            const beforeDot = textBeforeCursor.split('.');
            const varName = beforeDot[beforeDot.length - 2].split(/\s|;|,|\(|\)/).pop();
            
            // Basic suggestions based on common objects
            if (varName === 'document' || varName === 'element') {
                return jsMethods.filter(m => m.startsWith('query') || 
                                           m.startsWith('getElement') || 
                                           m.startsWith('create'));
            }
            
            if (varName === 'classList') {
                return ['add()', 'remove()', 'toggle()', 'contains()'];
            }
            
            if (varName === 'style') {
                return cssProperties.map(prop => `${prop} = `);
            }
            
            if (varName === 'array' || varName.match(/s$/) || varName === 'items') {
                return ['length', 'push()', 'pop()', 'shift()', 'unshift()', 
                        'slice()', 'splice()', 'forEach()', 'map()', 'filter()'];
            }
            
            return jsMethods;
        }
        
        return [];
    }
    
    function insertSuggestion(editor, suggestion) {
        const cursorPos = editor.selectionStart;
        const textBeforeCursor = editor.value.substring(0, cursorPos);
        const textAfterCursor = editor.value.substring(cursorPos);
        
        // Find the last trigger character
        let insertPos = textBeforeCursor.length;
        let i = insertPos - 1;
        while (i >= 0 && !['<', '.', ':', ' '].includes(textBeforeCursor[i])) {
            i--;
        }
        
        editor.value = textBeforeCursor.substring(0, i + 1) + suggestion + textAfterCursor;
        editor.selectionStart = editor.selectionEnd = i + 1 + suggestion.length;
        editor.focus();
    }
});