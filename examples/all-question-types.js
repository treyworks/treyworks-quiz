/**
 * Define your quiz questions
 */
const ALL_QUESTION_TYPES = [
    {
      "question": "Single Choice Question (Radio Buttons)",
      "options": [
        { "value": "option1", "label": "Option 1" },
        { "value": "option2", "label": "Option 2" },
        { "value": "option3", "label": "Option 3" },
        { "value": "option4", "label": "Option 4" }
      ],
      "multiple": false
    },
    {
      "question": "Multiple Choice Question (Checkboxes)",
      "options": [
        { "value": "option1", "label": "Option 1" },
        { "value": "option2", "label": "Option 2" },
        { "value": "option3", "label": "Option 3" },
        { "value": "option4", "label": "Option 4" }
      ],
      "multiple": true
    },
    {
      "question": "Text Input Question (Single Line)",
      "options": [
        { 
          "type": "text", 
          "label": "Your answer", 
          "placeholder": "Type your answer here..." 
        }
      ],
      "multiple": false
    },
    {
      "question": "Required Text Input Question",
      "options": [
        { 
          "type": "text", 
          "label": "Your name", 
          "placeholder": "Enter your full name",
          "required": true
        }
      ],
      "multiple": false
    },
    {
      "question": "Textarea Question (Multi-line)",
      "options": [
        { 
          "type": "textarea", 
          "label": "Your detailed response", 
          "placeholder": "Please provide more details...",
          "rows": 4
        }
      ],
      "multiple": false
    },
    {
      "question": "Required Textarea Question",
      "options": [
        { 
          "type": "textarea", 
          "label": "Your feedback", 
          "placeholder": "Please share your thoughts...",
          "rows": 5,
          "required": true
        }
      ],
      "multiple": false
    },
    {
      "question": "Mixed Question Types",
      "options": [
        { "value": "yes", "label": "Yes, I'd like to provide additional information" },
        { "value": "no", "label": "No, I'll skip the additional information" }
      ],
      "multiple": false
    },
    {
      "question": "Additional Information",
      "options": [
        { 
          "type": "textarea", 
          "label": "Please share any additional information", 
          "placeholder": "Enter any other details you'd like us to know...",
          "rows": 4
        }
      ],
      "multiple": false
    }
  ];