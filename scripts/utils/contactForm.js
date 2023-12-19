const contactForm = {

  createContactForm () {
    const $contactModalSection = document.createElement('section')
    $contactModalSection.classList.add('contact-modal')
    $contactModalSection.setAttribute('role', 'dialog')
    $contactModalSection.setAttribute('aria-labelledby', 'modal-header')

    const $header = document.createElement('header')

    const $titleDiv = document.createElement('div')
    $titleDiv.classList.add('modal-header')

    const $h1 = document.createElement('h1')
    $h1.textContent = 'Contactez-moi'

    const $photographerName = document.createElement('h1')
    $photographerName.classList.add('photograph-name')

    $titleDiv.appendChild($h1)
    $titleDiv.appendChild($photographerName)

    const $closeButton = document.createElement('button')
    $closeButton.id = 'close-button'
    $closeButton.classList.add('icon-control')
    $closeButton.setAttribute('aria-labelledby', 'close-button close-button-icon')
    $closeButton.setAttribute('aria-label', 'Close Contact form')

    const $closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $closeIcon.classList.add('close-button-icon')
    $closeIcon.setAttribute('aria-hidden', 'true')
    $closeIcon.setAttribute('viewBox', '0 0 384 512')
    $closeIcon.innerHTML = '<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>'

    $closeButton.appendChild($closeIcon)
    $header.appendChild($titleDiv)
    $header.appendChild($closeButton)

    const $form = document.createElement('form')
    $form.classList.add('contact-form')
    $form.setAttribute('method', 'get')

    const $firstNameDiv = document.createElement('div')
    const $firstNameLabel = document.createElement('label')
    $firstNameLabel.setAttribute('for', 'firstName')
    $firstNameLabel.textContent = 'Prénom'
    const $firstNameInput = document.createElement('input')
    $firstNameInput.id = 'firstName'
    $firstNameInput.type = 'text'
    $firstNameInput.setAttribute('autocomplete', 'given-name')
    $firstNameInput.setAttribute('required', 'required')
    $firstNameInput.setAttribute('aria-label', 'First Name')
    $firstNameInput.setAttribute('aria-required', 'true')
    const $firstNameError = document.createElement('span')
    $firstNameError.id = 'firstName-error'
    $firstNameError.classList.add('error-message')
    $firstNameDiv.appendChild($firstNameLabel)
    $firstNameDiv.appendChild($firstNameInput)
    $firstNameDiv.appendChild($firstNameError)

    const $lastNameDiv = document.createElement('div')
    const $lastNameLabel = document.createElement('label')
    $lastNameLabel.setAttribute('for', 'lastName')
    $lastNameLabel.textContent = 'Nom'
    const $lastNameInput = document.createElement('input')
    $lastNameInput.id = 'lastName'
    $lastNameInput.type = 'text'
    $lastNameInput.setAttribute('autocomplete', 'family-name')
    $lastNameInput.setAttribute('required', 'required')
    $lastNameInput.setAttribute('aria-label', 'Last Name')
    $lastNameInput.setAttribute('aria-required', 'true')

    const $lastNameError = document.createElement('span')
    $lastNameError.id = 'lastName-error'
    $lastNameError.classList.add('error-message')
    $lastNameDiv.appendChild($lastNameLabel)
    $lastNameDiv.appendChild($lastNameInput)
    $lastNameDiv.appendChild($lastNameError)

    const $emailDiv = document.createElement('div')
    const $emailLabel = document.createElement('label')
    $emailLabel.setAttribute('for', 'email')
    $emailLabel.textContent = 'Email'
    const $emailInput = document.createElement('input')
    $emailInput.id = 'email'
    $emailInput.type = 'email'
    $emailInput.setAttribute('autocomplete', 'email')
    $emailInput.setAttribute('required', 'required')
    $emailInput.setAttribute('aria-label', 'Email')
    $emailInput.setAttribute('aria-required', 'true')
    const $emailError = document.createElement('span')
    $emailError.id = 'email-error'
    $emailError.classList.add('error-message')
    $emailDiv.appendChild($emailLabel)
    $emailDiv.appendChild($emailInput)
    $emailDiv.appendChild($emailError)

    const $messageDiv = document.createElement('div')
    const $messageLabel = document.createElement('label')
    $messageLabel.setAttribute('for', 'message')
    $messageLabel.textContent = 'Votre message'
    const $messageTextarea = document.createElement('textarea')
    $messageTextarea.id = 'message'
    $messageTextarea.setAttribute('autocomplete', 'on')
    $messageTextarea.setAttribute('required', 'required')
    $messageTextarea.setAttribute('aria-label', 'Your message')
    $messageTextarea.setAttribute('aria-required', 'true')
    const $messageError = document.createElement('span')
    $messageError.id = 'message-error'
    $messageError.classList.add('error-message')
    $messageDiv.appendChild($messageLabel)
    $messageDiv.appendChild($messageTextarea)
    $messageDiv.appendChild($messageError)

    const $sendButton = document.createElement('button')
    $sendButton.classList.add('contact-button', 'send-button')
    $sendButton.textContent = 'Envoyer'
    $sendButton.setAttribute('aria-label', 'Send')

    $form.appendChild($firstNameDiv)
    $form.appendChild($lastNameDiv)
    $form.appendChild($emailDiv)
    $form.appendChild($messageDiv)
    $form.appendChild($sendButton)
    $contactModalSection.appendChild($header)
    $contactModalSection.appendChild($form)

    return $contactModalSection
  },

  initializeContactFormModal () {
    const $modal = document.querySelector('.contact-modal')
    const $form = document.querySelector('.contact-form')
    const $contactButton = document.querySelector('.contact-button')
    const $closeButton = document.getElementById('close-button')
    const $sendButton = document.querySelector('.send-button')

    $contactButton.addEventListener('click', (event) => this.toggleContactForm())
    $contactButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.toggleContactForm()
      }
    })

    $closeButton.addEventListener('click', (event) => {
      this.toggleContactForm()
      $form.reset()
      this.clearErrors()
    })
    $closeButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        this.toggleContactForm()
        $form.reset()
        this.clearErrors()
      }
    })

    $sendButton.addEventListener('click', (event) => {
      event.preventDefault()
      if (!this.validateContactForm()) {
        return
      }
      this.toggleContactForm()
      $form.reset()
    })
    $sendButton.addEventListener('keydown', (event) => {
      event.preventDefault()
      if (!this.validateContactForm()) {
        return
      }
      this.toggleContactForm()
      $form.reset()
    })
  },

  toggleContactForm (triggerElement) {
    const $mainContainer = document.querySelector('.main-container')
    const $modal = document.querySelector('.contact-modal')
    const isOpen = $modal.classList.toggle('open')

    if ($modal) {
      $mainContainer?.toggleAttribute('aria-hidden', isOpen)
      $mainContainer?.classList.toggle('form-filter', isOpen)

      $modal.toggleAttribute('aria-hidden', !isOpen)
      $modal.toggleAttribute('aria-modal', isOpen)
      $modal.setAttribute('tabindex', '0')
      $modal.classList.toggle('isopening', isOpen)

      if (isOpen) {
        this.lastFocusedElement = document.activeElement
        $modal.focus()

        const focusableElements = 'button, input, textarea, [tabindex]:not([tabindex="-1"])'
        const focusableElementsInModal = Array.from($modal.querySelectorAll(focusableElements))
        const firstFocusableElement = focusableElementsInModal[0]
        const lastFocusableElement = focusableElementsInModal[focusableElementsInModal.length - 1]

        $modal.addEventListener('keydown', (event) => this.handleTrapFocus(event, firstFocusableElement, lastFocusableElement))
      } else if (this.lastFocusedElement) {
        this.lastFocusedElement.focus()
        this.lastFocusedElement = null
      }
    }
  },

  handleTrapFocus (event, firstFocusableElement, lastFocusableElement) {
    const isTabPressed = event.key === 'Tab'

    if (!isTabPressed) {
      return
    }

    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus()
        event.preventDefault()
      }
    }
  },

  updateFieldError (id, message, isError) {
    const field = document.querySelector(`#${id}`)
    const fieldContainer = field.parentElement
    const errorMessage = document.querySelector(`#${id}-error`)

    if (isError) {
      fieldContainer.classList.add('error')
      errorMessage.textContent = message
      field.setAttribute('aria-invalid', 'true')
      field.setAttribute('aria-describedby', `${id}-error`)
      field.setAttribute('aria-errormessage', `${id}-error`)
    } else {
      fieldContainer.classList.remove('error')
      errorMessage.textContent = ''
      field.removeAttribute('aria-invalid')
      field.removeAttribute('aria-describedby')
      field.removeAttribute('aria-errormessage')
    }
  },

  clearErrors () {
    const errorFields = document.querySelectorAll('.error')
    errorFields.forEach(error => {
      const id = error.querySelector('input, textarea').id
      this.updateFieldError(id, '', false)
    })
  },

  validateContactForm () {
    const $form = document.querySelector('.contact-form')
    const getFieldValue = (id) => {
      const value = $form.querySelector(`#${id}`).value
      console.log(`Value of field ${id}: ${value}`)
      return value
    }
    const firstNameValue = getFieldValue('firstName')
    const lastNameValue = getFieldValue('lastName')
    const emailValue = getFieldValue('email')
    const messageValue = getFieldValue('message')

    let isValid = true

    if (firstNameValue === '') {
      this.updateFieldError('firstName', 'Le champ prénom ne doit pas être vide.', true)
      isValid = false
    } else {
      this.updateFieldError('firstName', '', false)
    }

    if (lastNameValue === '') {
      this.updateFieldError('lastName', 'Le champ nom ne doit pas être vide.', true)
      isValid = false
    } else {
      this.updateFieldError('lastName', '', false)
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    if (!emailRegex.test(emailValue)) {
      this.updateFieldError('email', 'Veuillez entrer une adresse email valide.', true)
      isValid = false
    } else {
      this.updateFieldError('email', '', false)
    }

    if (messageValue === '') {
      this.updateFieldError('message', 'Le champ message ne doit pas être vide.', true)
      isValid = false
    } else {
      this.updateFieldError('message', '', false)
    }

    return isValid
  }

}

export default contactForm
