# category_tag_input

This repository provides a solution for creating tags for category input fields in HTML pages. It allows users to easily add, remove within an input field, enhancing the user experience for categorizing content.

## Installation

To install the package, clone the repository:

```bash
git clone https://github.com/erenbozaci/category_tag_input.git
```

Navigate to the project directory:

```bash
cd category_tag_input
```

Don't forget to look examples in `examples.html` file.


## Usage

Include the necessary CSS and JavaScript files in your HTML:

```html
<link rel="stylesheet" href="path/to/category_tag_input.css">
```
in `<head>`

---
```html
<script src="path/to/category_tag_input.js"></script>
```
in `<body>`

---

Add the category tag input field to your HTML:

```html
<div class="category-tag-input">
    <select name="category-input[]" id="category-input" multiple>
        <option value="value1">Data1</option>
        <option value="value2">Data2</option>
        ...
    </select>
</div>
```

Initialize the category tag input in your JavaScript:

```javascript
const categoryTagInput = new CategoryTagInput({
    selector: '#category-input', // required, <select> element 
    initialTags: ['value1', 'value2'], // optional, initial tags, only option values
    maxTags: 2, // optional, 0 for infinity
    duplicate: false, // optional
    infoMessage: (maxTags) => `message` // optional
});
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

No license free to use.
