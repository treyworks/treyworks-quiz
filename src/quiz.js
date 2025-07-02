/**
 * Treyworks Quiz Library
 * A lightweight, customizable quiz component that supports multiple question types
 * including radio buttons, checkboxes, text inputs, and textareas.
 *
 * @version 1.0.2
 * @author Treyworks
 */
window.Quiz = (function() {
  /**
   * Initialize a new quiz instance
   * @param {Object} config - Configuration object for the quiz
   * @param {string} config.container - CSS selector for the quiz container
   * @param {Array} config.questions - Array of question objects
   * @param {string} config.submitUrl - URL to submit quiz results
   * @param {string} [config.submitTitle] - Title for the submission form
   * @param {string} [config.submitButtonText] - Text for the submit button
   * @param {Function} [config.onComplete] - Callback after successful submission
   * @param {boolean} [config.showProgressBar=true] - Whether to show the progress bar
   * @param {boolean} [config.showQuestionCount=false] - Whether to show question count (e.g., "1 / 10")
   * @param {boolean} [config.emailRequired=false] - Whether the email field is required
   * @param {boolean} [config.showNameFields=false] - Whether to show first and last name fields
   * @param {boolean} [config.nameFieldsRequired=false] - Whether the name fields are required
   * @param {boolean} [config.showPhoneField=false] - Whether to show phone number field
   * @param {boolean} [config.phoneFieldRequired=false] - Whether the phone field is required
   * @param {string|Object} [config.successMessage] - Success message or HTML to show after submission
   * @param {boolean} [config.useResponseMessage=false] - If true, displays the message property from the response JSON instead of the static successMessage
   * @returns {void}
   */
  function init(config) {
    const container = document.querySelector(config.container);
    const questions = config.questions;
    const total = questions.length;
    const responses = {};

    // Store configuration values
    const submitUrl = config.submitUrl || '';
    const showProgressBar = config.showProgressBar !== undefined ? config.showProgressBar : true;
    const showQuestionCount = config.showQuestionCount !== undefined ? config.showQuestionCount : false;
    const emailRequired = config.emailRequired !== undefined ? config.emailRequired : true;
    const showNameFields = config.showNameFields || false;
    const nameFieldsRequired = config.nameFieldsRequired || false;
    const showPhoneField = config.showPhoneField || false;
    const phoneFieldRequired = config.phoneFieldRequired || false;
    const successMessage = config.successMessage || 'Thank you! Your submission has been received.';
    const useResponseMessage = config.useResponseMessage || false;
    const consentRequired = config.consentRequired || false;
    const consentMessage = config.consentMessage || 'I agree to receive communications and accept the privacy policy.';
    const privacyPolicyLink = config.privacyPolicyLink || '';

    // Create progress bar to show quiz completion status (if enabled)
    let progress, bar;
    if (showProgressBar) {
      progress = document.createElement('div');
      progress.className = 'quiz-progress';
      const bar = document.createElement('div');
      bar.className = 'quiz-progress-bar';
      bar.style.width = '0%';
      progress.appendChild(bar);
      container.appendChild(progress);
    }

    // Create card container for each question in the quiz
    questions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';
      if (idx === 0) card.classList.add('active');
      card.dataset.index = idx;

      // Create question header with optional question count
      const questionHeader = document.createElement('div');
      questionHeader.className = 'quiz-question-header';
      
      // Create the main question text
      const h = document.createElement('h3');
      h.className = 'quiz-question';
      h.textContent = showQuestionCount ? q.question : `${idx+1}. ${q.question}`;
      questionHeader.appendChild(h);
      
      // Add question counter if enabled
      if (showQuestionCount) {
        const counter = document.createElement('div');
        counter.className = 'quiz-question-counter';
        counter.textContent = `${idx+1} / ${total}`;
        questionHeader.appendChild(counter);
      }
      
      card.appendChild(questionHeader);

      const ul = document.createElement('ul');
      ul.className = 'quiz-options';
      q.options.forEach(opt => {
        const li = document.createElement('li');
        li.className = 'quiz-option';
        
        /**
         * Handle different input types: radio, checkbox, text, textarea
         * The library supports four types of inputs:
         * 1. Radio buttons (single choice) - default when multiple=false
         * 2. Checkboxes (multiple choice) - when multiple=true
         * 3. Text inputs (single line) - when type='text'
         * 4. Textareas (multiline) - when type='textarea'
         */
        if (opt.type === 'text' || opt.type === 'textarea') {
          // Text input (single or multiline)
          const labelWrapper = document.createElement('div');
          labelWrapper.className = 'quiz-label-wrapper';
          
          const label = document.createElement('label');
          label.className = 'quiz-text-label';
          label.textContent = opt.label;
          labelWrapper.appendChild(label);
          li.appendChild(labelWrapper);
          
          // Create appropriate input element
          const inputWrapper = document.createElement('div');
          inputWrapper.className = 'quiz-input-wrapper';
          
          const inp = opt.type === 'textarea' 
            ? document.createElement('textarea')
            : document.createElement('input');
          
          if (opt.type === 'text') inp.type = 'text';
          inp.name = `q${idx}`;
          inp.className = 'quiz-input quiz-input-fullwidth';
          inp.placeholder = opt.placeholder || '';
          
          // Add required attribute if specified
          if (opt.required) {
            inp.required = true;
            label.innerHTML = `${opt.label} <span class="quiz-required">*</span>`;
          }
          
          if (opt.rows && opt.type === 'textarea') {
            inp.rows = opt.rows;
          }
          
          inputWrapper.appendChild(inp);
          li.appendChild(inputWrapper);
          
          // Add special class to the list item for text inputs
          li.classList.add('quiz-option-text');
        } else {
          // Standard radio/checkbox options
          const label = document.createElement('label');
          label.className = 'quiz-option-label';
          
          const inp = document.createElement('input');
          inp.className = 'quiz-checkbox-radio';
          inp.type = q.multiple ? 'checkbox' : 'radio';
          inp.name = `q${idx}`;
          inp.value = opt.value;
          
          const span = document.createElement('span');
          span.className = 'quiz-option-text';
          span.textContent = opt.label;
          
          label.appendChild(inp);
          label.appendChild(span);
          li.appendChild(label);
        }
        
        ul.appendChild(li);
      });
      card.appendChild(ul);

      // Create navigation buttons (Previous/Next)
      const btns = document.createElement('div');
      btns.className = 'quiz-buttons';
      
      // Previous button - disabled on first question
      const prev = document.createElement('button');
      prev.textContent = 'Previous'; 
      prev.className = 'quiz-btn quiz-btn-secondary';
      prev.disabled = idx===0; // Disable on first question
      prev.addEventListener('click', () => navigate(-1));
      
      // Next/Submit button - changes text on last question
      const next = document.createElement('button');
      next.textContent = idx===total-1 ? 'Submit' : 'Next'; // Change text on last card
      next.className = 'quiz-btn quiz-btn-primary';
      next.addEventListener('click', () => navigate(1));
      btns.appendChild(prev);
      btns.appendChild(next);
      card.appendChild(btns);

      container.appendChild(card);
    });

    /**
     * Helper: show non-intrusive alert on a card
     * Creates or updates an alert message for validation errors
     * @param {string} msg - The alert message to display
     * @param {HTMLElement} card - The card element to show the alert on
     * @returns {void}
     */
    function showAlert(msg, card) {
      let alertDiv = card.querySelector('.quiz-alert');
      if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.className = 'quiz-alert';
        card.querySelector('.quiz-buttons').before(alertDiv);
      }
      alertDiv.textContent = msg;
    }

    /**
     * Helper: clear alert from a card
     * Removes any existing alert messages from the card
     * @param {HTMLElement} card - The card element to clear alerts from
     * @returns {void}
     */
    function clearAlert(card) {
      const alertDiv = card.querySelector('.quiz-alert');
      if (alertDiv) alertDiv.remove();
    }

    /**
     * Compile quiz results into a formatted string
     * Formats all question responses for submission, handling different input types
     * @returns {string} Formatted string with all question responses
     */
    function compileResults() {
      return questions.map((q, i) => {
        const ans = responses[`q${i}`] || [];
        
        // Handle text responses differently
        const hasTextInputs = q.options.some(opt => opt.type === 'text' || opt.type === 'textarea');
        
        if (hasTextInputs) {
          // For text inputs, include the question labels with responses
          return `${i+1}. ${q.question}:\n${q.options.map((opt, j) => {
            const response = ans[j] || '';
            return `   ${opt.label}: ${response}`;
          }).join('\n')}`;
        } else {
          // For regular radio/checkbox options
          return `${i+1}. ${q.question}: ${ans.join(', ')}`;
        }
      }).join('\n');
    }

    /**
     * Display a success message after quiz submission
     * @param {string|Object} message - Success message text or HTML content
     * @returns {void}
     */
    function showSuccessMessage(message) {
      container.innerHTML = '';
      const successContainer = document.createElement('div');
      successContainer.className = 'quiz-success-container';
      
      // Create message container
      const messageContainer = document.createElement('div');
      messageContainer.className = 'quiz-success-message';
      
      // Handle different message types
      if (typeof message === 'string') {
        // Check if the string contains HTML tags
        if (/<[a-z][\s\S]*>/i.test(message)) {
          // If it contains HTML tags, use innerHTML to render them
          messageContainer.innerHTML = message;
        } else {
          // Otherwise use textContent for security
          messageContainer.textContent = message;
        }
      } else if (typeof message === 'object') {
        // If message is an HTML object or element
        if (message.html) {
          messageContainer.innerHTML = message.html;
        } else if (message.text) {
          messageContainer.textContent = message.text;
        }
      }
      
      successContainer.appendChild(messageContainer);
      container.appendChild(successContainer);
    }
    
    /**
     * Show email submission form
     * Displays the final form for collecting email and submitting results
     * @returns {void}
     */
    function showSubmit() {
      container.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'quiz-submit-container';
      const title = config.submitTitle || 'Enter your email to receive your AI action plan';
      
      // Create title
      const titleEl = document.createElement('h3');
      titleEl.className = 'quiz-submit-title';
      titleEl.textContent = title;
      div.appendChild(titleEl);
      
      // Create label and input wrapper
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'quiz-input-wrapper';
      
      // Create name fields if enabled
      let firstNameInput, lastNameInput;
      if (showNameFields) {
        const nameWrapper = document.createElement('div');
        nameWrapper.className = 'quiz-input-wrapper quiz-name-fields';
        
        // First name input
        const firstNameLabel = document.createElement('label');
        firstNameLabel.className = 'quiz-label';
        firstNameLabel.textContent = nameFieldsRequired ? 'First name (required)' : 'First name';
        
        firstNameInput = document.createElement('input');
        firstNameInput.type = 'text';
        firstNameInput.className = 'quiz-input quiz-input-half';
        firstNameInput.placeholder = 'Enter your first name';
        firstNameInput.id = 'quiz-first-name';
        firstNameLabel.htmlFor = 'quiz-first-name';
        if (nameFieldsRequired) {
          firstNameInput.required = true;
        }
        
        // Last name input
        const lastNameLabel = document.createElement('label');
        lastNameLabel.className = 'quiz-label';
        lastNameLabel.textContent = nameFieldsRequired ? 'Last name (required)' : 'Last name';
        
        lastNameInput = document.createElement('input');
        lastNameInput.type = 'text';
        lastNameInput.className = 'quiz-input quiz-input-half';
        lastNameInput.placeholder = 'Enter your last name';
        lastNameInput.id = 'quiz-last-name';
        lastNameLabel.htmlFor = 'quiz-last-name';
        if (nameFieldsRequired) {
          lastNameInput.required = true;
        }
        
        const firstNameDiv = document.createElement('div');
        firstNameDiv.className = 'quiz-field-container';
        firstNameDiv.appendChild(firstNameLabel);
        firstNameDiv.appendChild(firstNameInput);
        
        const lastNameDiv = document.createElement('div');
        lastNameDiv.className = 'quiz-field-container';
        lastNameDiv.appendChild(lastNameLabel);
        lastNameDiv.appendChild(lastNameInput);
        
        nameWrapper.appendChild(firstNameDiv);
        nameWrapper.appendChild(lastNameDiv);
        div.appendChild(nameWrapper);
      }
      
      // Create email input
      const emailWrapper = document.createElement('div');
      emailWrapper.className = 'quiz-input-wrapper';
      
      const emailLabel = document.createElement('label');
      emailLabel.className = 'quiz-label';
      emailLabel.textContent = emailRequired ? 'Email address (required)' : 'Email address';
      emailLabel.htmlFor = 'quiz-email';
      
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.className = 'quiz-input quiz-input-fullwidth';
      emailInput.placeholder = 'Enter your email address';
      emailInput.id = 'quiz-email';
      if (emailRequired) {
        emailInput.required = true;
      }
      
      const emailFieldContainer = document.createElement('div');
      emailFieldContainer.className = 'quiz-field-container';
      emailFieldContainer.appendChild(emailLabel);
      emailFieldContainer.appendChild(emailInput);
      
      emailWrapper.appendChild(emailFieldContainer);
      div.appendChild(emailWrapper);
      
      // Create phone input if enabled
      let phoneInput;
      if (showPhoneField) {
        const phoneWrapper = document.createElement('div');
        phoneWrapper.className = 'quiz-input-wrapper';
        const phoneLabel = document.createElement('label');
        phoneLabel.className = 'quiz-label';
        phoneLabel.textContent = phoneFieldRequired ? 'Phone number (required)' : 'Phone number';
        phoneLabel.htmlFor = 'quiz-phone';
        
        phoneInput = document.createElement('input');
        phoneInput.type = 'tel';
        phoneInput.className = 'quiz-input quiz-input-fullwidth';
        phoneInput.placeholder = 'Phone number';
        phoneInput.id = 'quiz-phone';
        if (phoneFieldRequired) {
          phoneInput.required = true;
          phoneInput.placeholder = 'Phone number (required)';
        }
        
        const phoneFieldContainer = document.createElement('div');
        phoneFieldContainer.className = 'quiz-field-container';
        phoneFieldContainer.appendChild(phoneLabel);
        phoneFieldContainer.appendChild(phoneInput);
        
        phoneWrapper.appendChild(phoneFieldContainer);
        div.appendChild(phoneWrapper);
      }
      
      // Create consent checkbox if required
      let consentCheckbox;
      if (consentRequired) {
        const consentWrapper = document.createElement('div');
        consentWrapper.className = 'quiz-input-wrapper quiz-consent-wrapper';
        
        consentCheckbox = document.createElement('input');
        consentCheckbox.type = 'checkbox';
        consentCheckbox.className = 'quiz-consent-checkbox';
        consentCheckbox.id = 'quiz-consent';
        if (consentRequired) {
          consentCheckbox.required = true;
        }
        
        const consentLabel = document.createElement('label');
        consentLabel.className = 'quiz-consent-label';
        consentLabel.htmlFor = 'quiz-consent';
        
        // Create label text content
        consentLabel.textContent = consentMessage;
        
        // Add privacy policy link if provided
        if (privacyPolicyLink) {
          // Add space after consent message
          consentLabel.appendChild(document.createTextNode(' '));
          
          // Create privacy policy link
          const privacyLink = document.createElement('a');
          privacyLink.href = privacyPolicyLink;
          privacyLink.className = 'quiz-privacy-link';
          privacyLink.textContent = 'View Privacy Policy.';
          privacyLink.target = '_blank';
          privacyLink.rel = 'noopener noreferrer';
          
          consentLabel.appendChild(privacyLink);
        }
        
        const consentContainer = document.createElement('div');
        consentContainer.className = 'quiz-consent-container';
        consentContainer.appendChild(consentCheckbox);
        consentContainer.appendChild(consentLabel);
        
        consentWrapper.appendChild(consentContainer);
        div.appendChild(consentWrapper);
      }
      
      // Create alert container
      const alertEl = document.createElement('div');
      alertEl.className = 'quiz-alert';
      div.appendChild(alertEl);
      
      // Create button
      const btnWrapper = document.createElement('div');
      btnWrapper.className = 'quiz-btn-wrapper';
      const btn = document.createElement('button');
      btn.className = 'quiz-btn quiz-btn-primary quiz-mt-3';
      
      // Create button text span to keep text and loading indicator separate
      const btnTextSpan = document.createElement('span');
      btnTextSpan.textContent = config.submitButtonText || 'Send me the plan';
      btn.appendChild(btnTextSpan);
      
      // Create loading indicator
      const loadingIndicator = document.createElement('span');
      loadingIndicator.className = 'quiz-loading';
      btn.appendChild(loadingIndicator);
      
      btnWrapper.appendChild(btn);
      div.appendChild(btnWrapper);
      btn.addEventListener('click', () => {
        alertEl.textContent = '';
        const email = emailInput.value.trim();
        
        // Validate form fields
        let isValid = true;
        
        // Validate name fields if shown and required
        if (showNameFields && nameFieldsRequired) {
          const firstName = firstNameInput.value.trim();
          const lastName = lastNameInput.value.trim();
          
          if (!firstName) {
            firstNameInput.classList.add('quiz-input-error');
            isValid = false;
          } else {
            firstNameInput.classList.remove('quiz-input-error');
          }
          
          if (!lastName) {
            lastNameInput.classList.add('quiz-input-error');
            isValid = false;
          } else {
            lastNameInput.classList.remove('quiz-input-error');
          }
          
          if (!isValid) {
            alertEl.textContent = 'Please enter your full name.';
            return;
          }
        }
        
        // Validate email
        if (emailRequired && !email) {
          emailInput.classList.add('quiz-input-error');
          alertEl.textContent = 'Please enter your email address.';
          return;
        } else if (email && !/^\S+@\S+\.\S+$/.test(email)) {
          emailInput.classList.add('quiz-input-error');
          alertEl.textContent = 'Please enter a valid email address.';
          return;
        } else {
          emailInput.classList.remove('quiz-input-error');
        }
        
        // Validate phone if shown and required
        if (showPhoneField && phoneFieldRequired) {
          const phone = phoneInput.value.trim();
          if (!phone) {
            phoneInput.classList.add('quiz-input-error');
            alertEl.textContent = 'Please enter your phone number.';
            return;
          } else {
            phoneInput.classList.remove('quiz-input-error');
          }
        }
        
        // At this point, all validation has passed
        // Disable the button to prevent multiple submissions
        btn.disabled = true;
        btn.classList.add('submitting');
        btnTextSpan.textContent = 'Submitting...';
        
        // Prepare submission data
        const submissionData = {
          email,
          results: compileResults()
        };
        
        // Add name fields if present
        if (showNameFields) {
          submissionData.first_name = firstNameInput.value.trim();
          submissionData.last_name = lastNameInput.value.trim();
        }
        
        // Add phone if present
        if (showPhoneField) {
          submissionData.phone = phoneInput.value.trim();
        }
        
        // Add consent if present
        if (consentRequired) {
          submissionData.consent = consentCheckbox.checked;
        }
        
        fetch(submitUrl, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(submissionData)
        }).then(res => {
          // Remove loading state regardless of result
          btn.classList.remove('submitting');
          
          if (res.ok) {
            // Handle successful submission
            if (config.onComplete) {
              // If onComplete callback is provided, use it
              container.innerHTML = config.onComplete(responses);
            } else if (useResponseMessage) {
              // Get message from response text directly if useResponseMessage is enabled
              res.text().then(text => {
                // Use the entire response text as the message
                showSuccessMessage(text || config.successMessage || 'Thank you! Your submission has been received.');
              }).catch(() => {
                // Fallback if response reading fails
                showSuccessMessage(config.successMessage || 'Thank you! Your submission has been received.');
              });
            } else if (config.successMessage) {
              // If successMessage is provided and useResponseMessage is false, display static message
              showSuccessMessage(config.successMessage);
            } else {
              // Default success message
              showSuccessMessage('Thank you! Your submission has been received.');
            }
          } else {
            alertEl.textContent = 'Submission failed. Try again.';
            btn.disabled = false;
            btnTextSpan.textContent = config.submitButtonText || 'Send me the plan';
          }
        }).catch(() => {
          alertEl.textContent = 'Submission error.';
          btn.disabled = false;
          btn.classList.remove('submitting');
          btnTextSpan.textContent = config.submitButtonText || 'Send me the plan';
        });
      });
      container.appendChild(div);
    }

    /**
     * Navigate between quiz cards
     * Handles validation, data collection, and navigation between questions
     * @param {number} step - Direction to navigate: 1 for next, -1 for previous
     * @returns {void}
     */
    function navigate(step) {
      const cards = container.querySelectorAll('.quiz-card');
      const active = container.querySelector('.quiz-card.active');
      const idx = parseInt(active.dataset.index,10);
      if (step > 0) { // Moving forward - validate and collect responses
        // Get the question type to determine validation logic
        const question = questions[idx];
        const hasTextInputs = question.options.some(opt => opt.type === 'text' || opt.type === 'textarea');
        
        if (hasTextInputs) {
          // Handle text/textarea inputs - collect values and validate required fields
          const textInputs = active.querySelectorAll('input[type="text"], textarea');
          const values = Array.from(textInputs).map(input => input.value.trim());
          
          // Check if any required text inputs are empty
          const emptyRequired = Array.from(textInputs)
            .some(input => input.required && input.value.trim() === '');
            
          // Highlight empty required fields
          if (emptyRequired) {
            Array.from(textInputs).forEach(input => {
              if (input.required && input.value.trim() === '') {
                input.classList.add('quiz-input-error');
              } else {
                input.classList.remove('quiz-input-error');
              }
            });
          }
            
          if (emptyRequired) {
            showAlert('Please fill in all required fields.', active); 
            return; 
          }
          
          clearAlert(active);
          responses[`q${idx}`] = values;
        } else {
          // Handle radio/checkbox inputs - validate at least one option is selected
          const inputs = active.querySelectorAll('input');
          const checked = Array.from(inputs).filter(i => i.checked);
          
          // Validation: require at least one selection
          if (checked.length === 0) { 
            showAlert('Please select an option.', active); 
            return; 
          }
          
          clearAlert(active);
          // Store selected values in responses object
          responses[`q${idx}`] = checked.map(i => i.value);
        }
      } else { // Moving backward - just clear any alerts
        clearAlert(active);
      }
      // Remove active class from current card
      active.classList.remove('active');
      const nextIdx = idx+step;
      
      if (nextIdx < questions.length) {
        // Show the next/previous card
        container.querySelector(`.quiz-card[data-index="${nextIdx}"]`).classList.add('active');
        // Update progress bar if enabled
        if (showProgressBar) {
          progress.querySelector('.quiz-progress-bar').style.width = `${(nextIdx)/total*100}%`;
        }
      } else {
        // Quiz completed: show email submission form
        if (showProgressBar) {
          progress.querySelector('.quiz-progress-bar').style.width = '100%';
        }
        showSubmit();
      }
    }
  }
  return { init };
})();
