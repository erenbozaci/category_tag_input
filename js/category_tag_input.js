
/**
* @author Eren Bozacı
* @class CategoryTags
* This class is used to create tags for categories input field.
* v.1.1.0
* */
class Tag {
    /**
     * @param {string} label - The label of the suggestion
     * @param {string} value - The value of the suggestion
     * @param {string} targetOption - The target option of the suggestion
     */
    constructor(label, value, targetOption) {
        this.label = label;
        this.value = value;
        this.targetOption = targetOption;
    }
}

class CategoryTagInput {
    /**
     * @param {Object} settings
     * @param {string} settings.selector - The selector of the input field
     * @param {Array<string>} settings.initalTags - The initial tags, option values only (Optional, Default: [])
     * @param {string} settings.placeholder - The placeholder for the input field (Optional, Default: 'Add tags')
     * @param {number} settings.maxTags - The maximum number of tags, 0 for infinty (Optional, Default: 5)
     * @param {boolean} settings.duplicate - The duplicate tags are allowed or not (Optional, Default: false)
     * @param {function} settings.infoMessage - The info message for the tags (Optional, Default: 'You can add 5 tags')
     */
    constructor(settings) {
        this.settings = settings;
        /**
         * @type {Array<Tag>} tags - The tags which are user added
         */
        this.tags = [];
        this.suggestions = [];
        this.initalTags = this.settings.initalTags || [];
        
        // errors
        if (!this.settings.selector) {
            throw new Error('Selector is required');
        } else if (this.settings.maxTags && typeof this.settings.maxTags !== 'number') {
            throw new Error('Max tags should be a number');
        } else if (this.settings.duplicate && typeof this.settings.duplicate !== 'boolean') {
            throw new Error('Duplicate should be a boolean');
        } else if (this.settings.infoMessage && typeof this.settings.infoMessage !== 'function') {
            throw new Error('Info message should be a function');
        } else if (this.settings.placeholder && typeof this.settings.placeholder !== 'string') {
            throw new Error('Placeholder should be a string');
        } else if (this.settings.initalTags && !Array.isArray(this.settings.initalTags)) {
            throw new Error('Initial tags should be an array');
        }
        
        if (this.settings.infoMessage && this.settings.infoMessage(this.settings.maxTags)) {
            this.infoMessageMethod = this.settings.infoMessage;
        } else {
            this.infoMessageMethod = (maxTags) => `You can add only ${this.maxTags} tags`;
        }



        /**
         * @type {function} onAdd - The callback function when a tag is added
         * @param {Tag} tag - The tag which is added
         */
        this.onAdd = (tag) => {};
        /**
         * @type {function} onRemove - The callback function when a tag is removed
         * @param {Tag} tag - The tag which is removed
         */
        this.onRemove = (tag) => {};
        /**
         * @type {function} onTagChange - The callback function when tags are changed
         * @param {Array<Tag>} tags - The tags which are user added
         */
        this.onTagChange = (tags) => {};
        /**
         * @type {function} onError - The callback function when an error occurs
         * @param {string} message - The error message
         */
        this.onError = (message) => {};
        /**
         * @type {function} onInputChange - The callback function when the input field is changed
         * @param {string} value - The value of the input field
         * 
         */
        this.onInputChange = (value) => {};

        this.init();
    }

    init() {
        /**
         * @type {HTMLSelectElement} selectInput - The input field
         */
        this.selectInput = document.querySelector(this.settings.selector);
        this.selectInput.style.display = 'none';
        this.placeholder = this.settings.placeholder || 'Add tags';
        this.maxTags = this.settings.maxTags < 0 ? 5 : this.settings.maxTags;
        this.duplicate = this.settings.duplicate || false;
        this.parent = this.selectInput.parentNode;

        this.createHTMLElements();

        this.tagInput.addEventListener('keyup', this.handleInput.bind(this));

        if (this.initalTags.length > 0) {
            console.log(this.initalTags);
            
            this.initalTags.forEach(tag => {
                const option = this.selectInput.querySelector(`option[value="${tag}"]`);
                this.addTag(new Tag(option.innerHTML, option.value, option));
            });
        }
    }

    /**
     * @param {Tag} tag 
     * @returns 
     */
    addTag(tag) {
        if (this.maxTags > 0 && this.tags.length >= this.maxTags) {
            this.handleError('You can add only '+ this.maxTags +' tags');
            return;
        } else if (!this.duplicate && this.tags.includes(tag)) {
            this.handleError('This tag is already added');
            return;
        } else if (tag.label === '' || tag.value === '') {
            this.handleError('Tag cannot be empty');
            return;
        }

        this.tags.push(tag);
        this.tagInput.value = '';
        this.renderTags();
        this.onAdd(tag);
    }

    /**
     * @param {Tag} tag 
     */
    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
        this.renderTags();

        this.onRemove(tag);
    }

    /**
     * @param {string} event - The event name ('add', 'remove', 'tagchange', 'inputchange', 'error',)
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
            case 'tagchange':
                this.onTagChange = callback;
                break;
            case 'inputchange':
                this.onInputChange = callback;
                break;
            case 'error':
                this.onError = callback;
                break;   
            default:
                break;
        }
    }

    handleInput(e) {
        const val = this.tagInput.value;

        if (e.keyCode === 40 && this.suggestions.length > 0) {
            this.suggestionContainer.querySelector('.suggestion').focus();
            return;
        }

        this.suggestTags(val);
        this.onInputChange(val);
    }

    handleError(message) {
        this.errorContainer.style.display = 'block';
        this.errorContainer.innerHTML = message;
        setTimeout(() => {
            this.errorContainer.style.display = 'none';
        }, 3000);

        this.onError(message);
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
        if (this.maxTags > 0) {
            this.infoMessage = document.createElement('div');
            this.infoMessage.classList.add('text-secondary');
            this.infoMessage.innerHTML = this.infoMessageMethod(this.maxTags);
            this.parent.appendChild(this.infoMessage);
        }
    }

    suggestTags(val) {
        if (val.length > 0) {
            this.suggestions = [...this.selectInput.options].filter(suggestion => {
                const suggestionText = suggestion.innerHTML.toLowerCase();
                const inputText = val.toLowerCase();
                const isDuplicate = this.tags.some(tag => tag.value === suggestion.value);
                return suggestionText.includes(inputText) && (this.duplicate || !isDuplicate);
            });
            
            this.renderSuggestions();
        } else {
            if (!this.suggestionContainer.classList.contains('hidden')) this.suggestionContainer.classList.add('hidden')
        }
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
            const tag = new Tag(suggestion.innerHTML, suggestion.value, suggestion);

            const suggestionElement = document.createElement('div');
            suggestionElement.classList.add('suggestion');
            suggestionElement.setAttribute('tabindex', '0');
            suggestionElement.innerHTML = suggestion.innerHTML;
            suggestionElement.dataset.ind = Array.from(this.suggestions).findIndex(s => s.innerHTML === suggestion.innerHTML);
            this.suggestionContainer.appendChild(suggestionElement);

            suggestionElement.addEventListener('click', e => {
                this.addTag(tag);
                this.suggestionContainer.classList.add('hidden')
            });

            suggestionElement.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    this.addTag(tag);
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
            tagElement.innerHTML = `<b>${tag.label}</b>&times;`; // &times; can be changed with an icon
            this.tagContainer.insertBefore(tagElement, this.tagInput);

            tag.targetOption.selected = true;

            tagElement.addEventListener('click', e => {
                this.removeTag(tag);
                tag.targetOption.selected = false;
            });
        });
        this.onTagChange(this.tags);
    }
    /**
     * @returns {Array} - The tags which are user added
     */
    getTags() {
        return this.tags;
    }
}
