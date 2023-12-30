const contactForm = {

  createContactForm () {
    const $contactModalSection = document.createElement('section')
    $contactModalSection.classList.add('contact-modal')
    $contactModalSection.setAttribute('role', 'dialog')
    $contactModalSection.setAttribute('aria-labelledby', 'contact-title')

    const $header = document.createElement('header')

    const $titlesDiv = document.createElement('div')
    $titlesDiv.classList.add('header-titles')

    const $h1 = document.createElement('h1')
    $h1.id = 'contact-title'
    $h1.textContent = 'Contactez-moi'

    const $photographerName = document.createElement('h1')
    $photographerName.classList.add('photograph-name')

    $titlesDiv.appendChild($h1)
    $titlesDiv.appendChild($photographerName)

    const $closeButton = document.createElement('button')
    $closeButton.id = 'close-button'
    $closeButton.classList.add('icon-control')
    $closeButton.setAttribute('aria-label', 'Ferme le formulaire de contact')

    const $closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $closeIcon.classList.add('close-button-icon')
    $closeIcon.setAttribute('aria-hidden', 'true')
    $closeIcon.setAttribute('viewBox', '0 0 384 512')
    $closeIcon.innerHTML = '<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>'

    $closeButton.appendChild($closeIcon)
    $header.appendChild($titlesDiv)
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
    $firstNameInput.setAttribute('aria-label', 'Prénom')
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
    $lastNameInput.setAttribute('aria-label', 'Nom')
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
    $messageTextarea.setAttribute('aria-label', 'Votre message')
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
    $sendButton.setAttribute('aria-label', 'Envoie le formulaire de contact')

    $form.appendChild($firstNameDiv)
    $form.appendChild($lastNameDiv)
    $form.appendChild($emailDiv)
    $form.appendChild($messageDiv)
    $form.appendChild($sendButton)
    $contactModalSection.appendChild($header)
    $contactModalSection.appendChild($form)

    return $contactModalSection
  },

  getModalElements () {
    const $mainContainer = document.querySelector('.main-container')
    const $modal = document.querySelector('.contact-modal')
    const $form = document.querySelector('.contact-form')

    return { $mainContainer, $modal, $form }
  },

  initializeContactFormModal () {
    const { $form } = this.getModalElements()
    const $contactButton = document.querySelector('.contact-button')
    const $closeButton = document.getElementById('close-button')
    const $sendButton = document.querySelector('.send-button')

    const handleContactButton = (event) => {
      event.stopPropagation()
      this.openContactForm()
    }

    $contactButton.addEventListener('click', handleContactButton)
    $contactButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleContactButton(event)
      }
    })

    const handleCloseButton = (event) => {
      event.stopPropagation()
      this.closeContactForm()
      $form.reset()
      this.clearErrors()
    }

    $closeButton.addEventListener('click', handleCloseButton)
    $closeButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        handleCloseButton(event)
      }
    })

    const handleSendButton = (event) => {
      event.stopPropagation()
      event.preventDefault()
      if (this.validateContactForm()) {
        this.closeContactForm()
        $form.reset()
      }
    }

    $sendButton.addEventListener('click', handleSendButton)
    $sendButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        handleSendButton(event)
      }
    })
  },

  toggleAttributes ($mainContainer, $modal, isOpen) {
    $mainContainer?.toggleAttribute('aria-hidden', isOpen)
    $mainContainer?.classList.toggle('form-filter', isOpen)

    $modal.toggleAttribute('aria-hidden', !isOpen)
    $modal.toggleAttribute('aria-modal', isOpen)
    if (isOpen) {
      $modal.setAttribute('tabindex', '0')
    } else {
      $modal.setAttribute('tabindex', '-1')
    }
    $modal.classList.toggle('open', isOpen)
  },

  openContactForm () {
    const { $mainContainer, $modal, $form } = this.getModalElements()

    this.toggleAttributes($mainContainer, $modal, true)

    this.lastFocusedElement = document.activeElement
    $modal.focus()

    const focusableElements = 'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElementsInModal = Array.from($modal.querySelectorAll(focusableElements))
    const firstFocusableElement = focusableElementsInModal[0]
    const lastFocusableElement = focusableElementsInModal[focusableElementsInModal.length - 1]

    this.handleKeydown = (event) => {
      this.handleTrapFocus(event, firstFocusableElement, lastFocusableElement)
    }
    $modal.addEventListener('keydown', this.handleKeydown)

    this.handleDocumentClick = (event) => {
      const isClickInside = $modal?.contains(event.target)
      if (!isClickInside) {
        this.closeContactForm()
        $form.reset()
        this.clearErrors()
        document.removeEventListener('click', this.handleDocumentClick)
      }
    }

    document.addEventListener('click', this.handleDocumentClick)
  },

  closeContactForm () {
    const { $mainContainer, $modal } = this.getModalElements()

    this.toggleAttributes($mainContainer, $modal, false)

    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus()
      this.lastFocusedElement = null
    }

    $modal.removeEventListener('keydown', this.handleKeydown)
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
    const { $form } = this.getModalElements()
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
