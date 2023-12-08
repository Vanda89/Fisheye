const contactForm = {

  createContactForm () {
    const $contactModalSection = document.createElement('section')
    $contactModalSection.classList.add('contact-modal')

    const $header = document.createElement('header')

    const $titleDiv = document.createElement('div')
    $titleDiv.classList.add('modal-header')

    const $h2 = document.createElement('h2')
    $h2.textContent = 'Contactez-moi'

    const $photographerName = document.createElement('h2')
    $photographerName.classList.add('photograph-name')

    $titleDiv.appendChild($h2)
    $titleDiv.appendChild($photographerName)

    const $closeButton = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $closeButton.classList.add('icon-control', 'close-button')
    $closeButton.addEventListener('click', this.handleContactForm)
    $closeButton.setAttribute('alt', 'Icône de croix')
    $closeButton.setAttribute('viewBox', '0 0 384 512')
    $closeButton.innerHTML = '<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>'
    $closeButton.setAttribute('aria-label', 'Close Contact form')

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
    $firstNameInput.setAttribute('required', 'required')
    $firstNameInput.setAttribute('aria-label', 'First Name')
    $firstNameInput.setAttribute('aria-required', 'true')
    $firstNameDiv.appendChild($firstNameLabel)
    $firstNameDiv.appendChild($firstNameInput)

    const $lastNameDiv = document.createElement('div')
    const $lastNameLabel = document.createElement('label')
    $lastNameLabel.setAttribute('for', 'lastName')
    $lastNameLabel.textContent = 'Nom'
    const $lastNameInput = document.createElement('input')
    $lastNameInput.id = 'lastName'
    $lastNameInput.type = 'text'
    $lastNameInput.setAttribute('required', 'required')
    $lastNameInput.setAttribute('aria-label', 'Last Name')
    $lastNameInput.setAttribute('aria-required', 'true')
    $lastNameDiv.appendChild($lastNameLabel)
    $lastNameDiv.appendChild($lastNameInput)

    const $emailDiv = document.createElement('div')
    const $emailLabel = document.createElement('label')
    $emailLabel.setAttribute('for', 'email')
    $emailLabel.textContent = 'Email'
    const $emailInput = document.createElement('input')
    $emailInput.id = 'email'
    $emailInput.type = 'email'
    $emailInput.setAttribute('required', 'required')
    $emailInput.setAttribute('aria-label', 'Email')
    $emailInput.setAttribute('aria-required', 'true')
    $emailDiv.appendChild($emailLabel)
    $emailDiv.appendChild($emailInput)

    const $messageDiv = document.createElement('div')
    const $messageLabel = document.createElement('label')
    $messageLabel.setAttribute('for', 'messageLabel')
    $messageLabel.textContent = 'Votre message'
    const $messageTextarea = document.createElement('textarea')
    $messageTextarea.id = 'message'
    $messageTextarea.setAttribute('required', 'required')
    $messageTextarea.setAttribute('aria-label', 'Your message')
    $messageTextarea.setAttribute('aria-required', 'true')
    $messageDiv.appendChild($messageLabel)
    $messageDiv.appendChild($messageTextarea)

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

  handleContactForm () {
    const $modal = document.querySelector('.contact-modal')
    $modal.classList.toggle('open')
  }
}

export default contactForm
