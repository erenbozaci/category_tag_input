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

Open `index.html` file and everything in your service.


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
<div id="category-tag-input"></div>
```

Initialize the category tag input in your JavaScript:

```javascript
const categoryTagInput = new CategoryTagInput({
            selector: '#category-tag-input', // required, <select> element 
            suggestions: [] // required
            maxTags: 2, // optional
            duplicate: false, // optional
            infoMessage: (maxTags) => `You are ${maxTags} tags` // optional
        });
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

No license free to use.
