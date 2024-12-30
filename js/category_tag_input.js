
/**
* @author Eren Bozacı
* @class CategoryTags
* This class is used to create tags for categories input field.
* v.1.0.0
* */
class CategoryTagInput {
    /**
     * @param {Object} settings
     * @param {string} settings.selector - The selector of the input field
     * @param {Array} settings.suggestions - The suggestions for the tags 
     * @param {string} settings.placeholder - The placeholder for the input field (Optional, Default: 'Add tags')
     * @param {number} settings.maxTags - The maximum number of tags (Optional, Default: 5)
     * @param {boolean} settings.duplicate - The duplicate tags are allowed or not (Optional, Default: false)
     * @param {function} settings.infoMessage - The info message for the tags (Optional, Default: 'You can add 5 tags')
     */
    constructor(settings) {
        this.settings = settings;
        this.tags = [];
        this.suggestions = [];
        
        // errors
        if (!this.settings.selector) {
            throw new Error('Selector is required');
        } else if (!this.settings.suggestions) {
            throw new Error('Suggestions are required');
        } else if (!Array.isArray(this.settings.suggestions)) {
            throw new Error('Suggestions should be an array');
        } else if (this.settings.maxTags && typeof this.settings.maxTags !== 'number') {
            throw new Error('Max tags should be a number');
        } else if (this.settings.duplicate && typeof this.settings.duplicate !== 'boolean') {
            throw new Error('Duplicate should be a boolean');
        } else if (this.settings.infoMessage && typeof this.settings.infoMessage !== 'function') {
            throw new Error('Info message should be a function');
        } else if (this.settings.placeholder && typeof this.settings.placeholder !== 'string') {
            throw new Error('Placeholder should be a string');
        }
        
        if (this.settings.infoMessage && this.settings.infoMessage(this.settings.maxTags)) {
            this.infoMessageMethod = this.settings.infoMessage;
        } else {
            this.infoMessageMethod = (maxTags) => `You can add ${this.maxTags} tags`;
        }

        this.onAdd = (tag) => { };
        this.onRemove = (tag) => {};
        this.onError = (message) => {};

        this.init();
    }

    init() {
        this.selectInput = document.querySelector(this.settings.selector);
        this.selectInput.style.display = 'none';
        this.placeholder = this.settings.placeholder || 'Add tags';
        this.maxTags = this.settings.maxTags || 5;
        this.duplicate = this.settings.duplicate || false;
        this.parent = this.selectInput.parentNode;

        this.createHTMLElements();

        this.tagInput.addEventListener('keyup', this.handleInput.bind(this));
    }

    handleInput(e) {
        const val = e.target.value;

        // iF THE USER PRESS down arrow key
        if (e.keyCode === 40 && this.suggestions.length > 0) {
            this.suggestionContainer.querySelector('.suggestion').focus();
            console.log('down arrow key pressed');
            return;
        }

        this.suggestTags(val);
    }

    addTag(tag) {
        if (this.tags.length >= this.maxTags) {
            this.handleError('You can add only '+ this.maxTags +' tags');
            return;
        } else if (!this.duplicate && this.tags.includes(tag)) {
            this.handleError('This tag is already added');
            return;
        } else if (tag === '') {
            this.handleError('Tag cannot be empty');
            return;
        }

        this.tags.push(tag);
        this.tagInput.value = '';
        this.renderTags();
        this.onAdd(tag);
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
        this.renderTags();

        this.onRemove(tag);
    }

    /**
     * @param {string} event - The event name ('add', 'remove', 'error')
     * @param {function} callback - The callback function
     */
    on(event, callback) {
        switch (event) {
            case 'add':
                this.onAdd = callback;
                break;
            case 'remove':
                this.onRemove = callback;
                break;
            case 'error':
                this.onError = callback;
                break;
            default:
                break;
        }
    }

    handleError(message) {
        this.errorContainer.style.display = 'block';
        this.errorContainer.innerHTML = message;
        setTimeout(() => {
            this.errorContainer.style.display = 'none';
        }, 3000);

        this.onError(message);
    }

    suggestTags(val) {
        if (val.length > 0) {
            this.suggestions = this.settings.suggestions.filter(suggestion => suggestion.toLowerCase().includes(val.toLowerCase()) && !this.tags.includes(suggestion));
            this.renderSuggestions();
        } else {
            if (!this.suggestionContainer.classList.contains('hidden')) this.suggestionContainer.classList.add('hidden')
        }
    }
    
    createHTMLElements() {
        // Create tag container
        this.tagContainer = document.createElement('div');
        this.tagContainer.classList.add('tag-container');
        this.tagInput = document.createElement('input');
        this.tagInput.type = 'text';
        this.tagInput.classList.add('tag-input');
        this.tagInput.setAttribute('placeholder', this.placeholder);
        // suggestion container
        this.suggestionContainer = document.createElement('div');
        this.suggestionContainer.classList.add('suggestions');
        this.suggestionContainer.classList.add('hidden');
        this.tagContainer.appendChild(this.suggestionContainer);
        // errors
        this.errorContainer = document.createElement('div');
        this.errorContainer.classList.add('error');

        // Append tag container and tag input to the DOM
        this.tagContainer.appendChild(this.tagInput);
        this.parent.appendChild(this.tagContainer);
        this.parent.appendChild(this.errorContainer);
        this.infoMessage = document.createElement('div');
        this.infoMessage.classList.add('text-secondary');
        this.infoMessage.innerHTML = this.infoMessageMethod(this.maxTags);
        this.parent.appendChild(this.infoMessage);
    }

    renderSuggestions() {
        if (this.suggestions.length === 0) {
            this.suggestionContainer.classList.add('hidden');
            return;
        }

        if (!this.suggestionContainer.classList.contains('hidden')) this.suggestionContainer.classList.add('hidden')

        this.suggestionContainer.classList.remove('hidden')

        this.suggestionContainer.innerHTML = '';

        this.suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.classList.add('suggestion');
            suggestionElement.setAttribute('tabindex', '0');
            suggestionElement.innerHTML = suggestion;
            this.suggestionContainer.appendChild(suggestionElement);

            suggestionElement.addEventListener('click', e => {
                this.addTag(e.target.innerHTML);
                this.suggestionContainer.classList.add('hidden')
            });

            suggestionElement.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    this.addTag(e.target.innerHTML);
                    this.suggestionContainer.classList.add('hidden')
                } else if (e.key === 'ArrowDown') {
                    if (suggestionElement.nextSibling) {
                        suggestionElement.nextSibling.focus();
                    }
                } else if (e.key === 'ArrowUp') {
                    if (suggestionElement.previousSibling) {
                        suggestionElement.previousSibling.focus();
                    } else {
                        this.tagInput.focus();
                    }
                }
            });
        });
    }

    renderTags() {
        [...this.tagContainer.querySelectorAll('.tag')].forEach(tag => tag.remove());
        this.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.setAttribute('class', 'tag badge badge-primary');
            tagElement.innerHTML = `<b>${tag}</b>&times;`; // it can be changed with an icon
            this.tagContainer.insertBefore(tagElement, this.tagInput);

            tagElement.addEventListener('click', e => {
                this.removeTag(tagElement.querySelector("b").innerHTML);
            });
        });
    }
    /**
     * @returns {Array} - The tags which are user added
     */
    getTags() {
        return this.tags;
    }
}
