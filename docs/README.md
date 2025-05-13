# Treyworks Quiz Library Documentation

This documentation provides detailed information about the Treyworks Quiz Library, its features, configuration options, and usage examples.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration Options](#configuration-options)
- [Question Schema](#question-schema)
- [Question Types](#question-types)
- [Styling](#styling)
- [API Reference](#api-reference)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)

## Installation

### NPM

```bash
npm install treyworks-quiz
```

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/treyworks-quiz@1.0.0/dist/quiz.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/treyworks-quiz@1.0.0/dist/quiz.min.js"></script>
```

### Direct Download

Download the [latest release](https://github.com/treyworks/quiz-library/releases) and include the files in your project:

```html
<link rel="stylesheet" href="path/to/quiz.min.css">
<script src="path/to/quiz.min.js"></script>
```

## Basic Usage

1. Include the CSS and JavaScript files in your HTML:

```html
<link rel="stylesheet" href="path/to/quiz.min.css">
<script src="path/to/quiz.min.js"></script>
```

2. Create a container element in your HTML:

```html
<div id="quiz"></div>
```

3. Define your quiz questions:

```javascript
const MY_QUESTIONS = [
  {
    "question": "What best describes your business?",
    "options": [
      { "value": "service", "label": "Service-based business" },
      { "value": "product", "label": "Product-based business" }
    ],
    "multiple": false
  }
];
```

4. Initialize the quiz:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  Quiz.init({
    container: '#quiz',
    submitUrl: '/api/submit-quiz',
    questions: MY_QUESTIONS
  });
});
```

## Configuration Options

The `Quiz.init()` method accepts a configuration object with the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | String | - | CSS selector for the quiz container |
| `questions` | Array | - | Array of question objects (see schema below) |
| `submitUrl` | String | - | URL to submit quiz results to |
| `submitTitle` | String | 'Enter your email to receive your AI action plan' | Title displayed on the submission form |
| `submitButtonText` | String | 'Send me the plan' | Text for the submit button |
| `onComplete` | Function | null | Callback function after successful submission |
| `successMessage` | String/Object | 'Thank you! Your submission has been received.' | Message to display after successful submission |
| `showProgressBar` | Boolean | true | Whether to show the progress bar at the top of the quiz |
| `showQuestionCount` | Boolean | false | Whether to show question count (e.g., "1 / 10") |

### Required Options

- `container`: CSS selector for the quiz container element
- `questions`: Array of question objects
- `submitUrl`: URL to submit quiz results to

### Optional Options

- `submitTitle`: Title displayed on the submission form
- `submitButtonText`: Text for the submit button
- `onComplete`: Callback function after successful submission
- `successMessage`: Message to display after successful submission
- `showProgressBar`: Whether to show the progress bar
- `showQuestionCount`: Whether to show question count

## Question Schema

Each question in the `questions` array should follow this schema:

```javascript
{
  "question": "The question text goes here?",
  "options": [
    // For radio buttons or checkboxes:
    { "value": "option1", "label": "Option 1 text" },
    { "value": "option2", "label": "Option 2 text" },
    // OR for text input:
    { "type": "text", "label": "Label for text input", "placeholder": "Placeholder text", "required": true },
    // OR for textarea:
    { "type": "textarea", "label": "Label for textarea", "placeholder": "Placeholder text", "rows": 4, "required": false }
  ],
  "multiple": false // Set to true for checkbox questions (multiple selections)
}
```

## Question Types

### Single Choice (Radio Buttons)

```javascript
{
  "question": "What is your favorite color?",
  "options": [
    { "value": "red", "label": "Red" },
    { "value": "blue", "label": "Blue" },
    { "value": "green", "label": "Green" }
  ],
  "multiple": false
}
```

### Multiple Choice (Checkboxes)

```javascript
{
  "question": "Which fruits do you like? (Select all that apply)",
  "options": [
    { "value": "apple", "label": "Apple" },
    { "value": "banana", "label": "Banana" },
    { "value": "orange", "label": "Orange" }
  ],
  "multiple": true
}
```

### Text Input

```javascript
{
  "question": "What is your job title?",
  "options": [
    { 
      "type": "text", 
      "label": "Job title", 
      "placeholder": "e.g., Marketing Manager",
      "required": true // Makes this field required
    }
  ],
  "multiple": false
}
```

### Textarea

```javascript
{
  "question": "Please describe your experience with our product:",
  "options": [
    { 
      "type": "textarea", 
      "label": "Your experience", 
      "placeholder": "Tell us about your experience...",
      "rows": 4,
      "required": true // Makes this field required 
    }
  ],
  "multiple": false
}
```

## Success Message Customization

You can customize the success message that appears after a successful submission in several ways:

1. **Simple string message**:
```javascript
successMessage: 'Thanks for completing our quiz!'
```

2. **HTML content**:
```javascript
successMessage: {
  html: '<h3>Thank you!</h3><p>We will send your personalized plan shortly.</p>'
}
```

3. **Plain text with custom formatting**:
```javascript
successMessage: {
  text: 'Your submission has been received. Check your inbox soon!'
}
```

If neither `successMessage` nor `onComplete` is provided, a default success message will be shown.

## Styling

The quiz library uses namespaced CSS classes (prefixed with `quiz-`) to avoid conflicts with your existing styles. You can override these styles in your own CSS file to match your site's design.

Key CSS classes:

- `.quiz-container` - The main container
- `.quiz-card` - Individual question cards
- `.quiz-progress` - Progress bar container
- `.quiz-progress-bar` - Progress bar fill
- `.quiz-question-header` - Container for question and counter
- `.quiz-question` - Question text
- `.quiz-question-counter` - Question counter (e.g., "1 / 10")
- `.quiz-options` - Options list container
- `.quiz-option` - Individual option item
- `.quiz-option-text` - Text input option
- `.quiz-btn` - Buttons
- `.quiz-btn-primary` - Primary action buttons
- `.quiz-btn-secondary` - Secondary action buttons
- `.quiz-input` - Text inputs and textareas
- `.quiz-input-error` - Styling for invalid or empty required fields
- `.quiz-required` - The asterisk (*) indicating required fields
- `.quiz-success-container` - Success message container
- `.quiz-success-icon` - Success icon
- `.quiz-success-message` - Success message text

## API Reference

### Quiz.init(config)

Initializes a new quiz instance with the provided configuration.

```javascript
Quiz.init({
  container: '#quiz',
  questions: QUESTIONS_ARRAY,
  submitUrl: '/api/submit',
  // other options...
});
```

## Server-Side Integration

When the user completes the quiz and submits their email, the library sends a POST request to the `submitUrl` with the following JSON payload:

```json
{
  "email": "user@example.com",
  "results": "1. Question 1: Selected option\n2. Question 2: Option A, Option B\n3. Question 3: User's text input"
}
```

The results are formatted as a string with each question numbered and followed by the user's response.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- iOS Safari (latest)
- Android Browser (latest)

## Troubleshooting

### Common Issues

#### Quiz doesn't appear

- Check if the container element exists in your HTML
- Verify that the CSS and JavaScript files are correctly included
- Check for JavaScript errors in the browser console

#### Form submission fails

- Verify that the `submitUrl` is correct and accessible
- Check that your server is properly handling the POST request
- Look for CORS issues if submitting to a different domain

#### Styling conflicts

- Check if your site's CSS is overriding the quiz styles
- Use more specific selectors in your CSS to target quiz elements

### Getting Help

If you encounter issues not covered in this documentation, please:

1. Check the [GitHub Issues](https://github.com/treyworks/quiz-library/issues) to see if your problem has been reported
2. Open a new issue if needed, providing as much detail as possible
3. Include browser information, error messages, and steps to reproduce the issue
