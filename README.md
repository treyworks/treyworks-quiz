# Treyworks Quiz Library

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/treyworks-quiz.svg)](https://www.npmjs.com/package/treyworks-quiz)

A lightweight, customizable quiz library for creating interactive quizzes on any website. The library supports multiple question types including radio buttons, checkboxes, text inputs, and textareas.

![Quiz Library Demo](docs/images/quiz-demo.png)

## Features

- Multiple question types (single choice, multiple choice, text input, textarea)
- Required field validation with visual indicators
- Progress bar that can be shown/hidden via configuration
- Question counter display (e.g., "1 / 10") that can be toggled
- Custom success messages after form submission
- Support for dynamic success messages from server responses
- Optional user consent checkbox with customizable message
- Comprehensive styling with namespaced CSS classes
- No external dependencies

## Installation

### NPM

```bash
npm install treyworks-quiz
```

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/treyworks-quiz@1.1.0/dist/quiz.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/treyworks-quiz@1.1.0/dist/quiz.min.js"></script>
```

### Direct Download

Download the [latest release](https://github.com/treyworks/quiz-library/releases) and include the files in your project:

```html
<link rel="stylesheet" href="path/to/quiz.min.css">
<script src="path/to/quiz.min.js"></script>
```

## Quick Start

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
  },
  {
    "question": "Which services are you interested in?",
    "options": [
      { "value": "web", "label": "Web Development" },
      { "value": "marketing", "label": "Digital Marketing" }
    ],
    "multiple": true
  }
];
```

4. Initialize the quiz:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  Quiz.init({
    container: '#quiz',
    submitUrl: '/api/submit-quiz',
    questions: MY_QUESTIONS,
    // Optional: Show dynamic message from server response
    useResponseMessage: true
  });
});
```

## Documentation

For detailed documentation, see the [docs folder](docs/README.md) or visit our [documentation site](https://treyworks.github.io/quiz-library/).

## Dynamic Success Messages

Starting with version 1.1.0, you can choose between displaying a static success message or one returned dynamically from your server's response:

```javascript
Quiz.init({
  // ... other options
  
  // Option 1: Static success message (default behavior)
  successMessage: 'Thank you for completing the quiz!',
  
  // Option 2: Dynamic success message from server
  useResponseMessage: true,  // Displays message from server response
  
  // User consent checkbox
  consentRequired: true, // Shows and requires consent checkbox
  consentMessage: 'I agree to receive marketing communications and accept the terms of service.',
  privacyPolicyLink: 'https://example.com/privacy' // Adds a "View Privacy Policy" link after consent message
});
```

When `useResponseMessage` is set to `true`, the entire response text from the server will be displayed as the success message:

```
Thank you, John! Your personalized results will be emailed to you shortly.
```

If the response is empty, the library will fall back to the static `successMessage` or the default success message.

## Examples

Check out the [examples directory](examples/) for complete working examples:

- [Basic Quiz](examples/basic.html)
- [All Question Types](examples/question-types.html)
- [Custom Styling](examples/custom-styling.html)
- [Advanced Configuration](examples/advanced-config.html)

## Configuration Options

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
| `emailRequired` | Boolean | false | Whether the email field is required |
| `showNameFields` | Boolean | false | Whether to show first and last name fields |
| `nameFieldsRequired` | Boolean | false | Whether the name fields are required |
| `showPhoneField` | Boolean | false | Whether to show phone number field |
| `phoneFieldRequired` | Boolean | false | Whether the phone field is required |
| `consentRequired` | Boolean | false | Whether to show and require a consent checkbox |
| `consentMessage` | String | 'I agree to receive communications and accept the privacy policy.' | Message to display next to consent checkbox |
| `privacyPolicyLink` | String | '' | URL for privacy policy page. If provided, adds a "View Privacy Policy" link after consent message |

For more detailed documentation on all available options and methods, see the [full documentation](docs/README.md).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- iOS Safari (latest)
- Android Browser (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for a lightweight, customizable quiz solution
- Thanks to all contributors who have helped shape this library
