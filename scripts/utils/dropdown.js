const dropdown = {

  createDropdown () {
    const $dropdown = document.createElement('div')
    $dropdown.classList.add('dropdown')

    const $sortBy = document.createElement('p')
    $sortBy.classList.add('sortingDropdown-trigger')
    $sortBy.textContent = 'Trier par'

    const $sortingDropdown = document.createElement('button')
    $sortingDropdown.id = 'sortingDropdown'
    $sortingDropdown.classList.add('sortingDropdown')
    $sortingDropdown.textContent = ''
    $sortingDropdown.setAttribute('role', 'button')
    $sortingDropdown.setAttribute('aria-haspopup', 'listbox')
    $sortingDropdown.setAttribute('aria-expanded', 'false')
    $sortingDropdown.setAttribute('aria-label', 'Menu déroulant fermé. Cliquez pour trier les médias par plusieurs options.')
    $sortingDropdown.setAttribute('tabindex', '0')

    const $chevronDown = document.createElement('button')
    $chevronDown.classList.add('chevron', 'chevron-down')
    $chevronDown.setAttribute('type', 'button')
    $chevronDown.setAttribute('aria-label', 'Menu déroulant fermé. Cliquez pour trier les médias par plusieurs options.')

    const $chevronDownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $chevronDownIcon.classList.add('chevron-down-icon')
    $chevronDownIcon.setAttribute('aria-hidden', 'true')
    $chevronDownIcon.setAttribute('viewBox', '0 0 512 512')
    $chevronDownIcon.setAttribute('fill', 'white')
    $chevronDownIcon.innerHTML = '<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>'
    $chevronDownIcon.setAttribute('width', '24')
    $chevronDownIcon.setAttribute('height', '24')

    const $sortMenu = document.createElement('div')
    $sortMenu.id = 'listbox'
    $sortMenu.setAttribute('role', 'listbox')
    $sortMenu.setAttribute('aria-activedescendant', 'popularité')
    $sortMenu.setAttribute('aria-labelledby', 'sortingDropdown')
    $sortMenu.setAttribute('aria-expanded', 'false')

    const $option1 = document.createElement('button')
    $option1.classList.add('sort-entry')
    $option1.id = 'popularité'
    $option1.setAttribute('role', 'option')
    $option1.setAttribute('aria-label', 'Trier par popularité')
    $option1.textContent = 'Popularité'

    const $option2 = document.createElement('button')
    $option2.classList.add('sort-entry')
    $option2.id = 'date'
    $option2.setAttribute('role', 'option')
    $option2.setAttribute('aria-label', 'Trier par date')
    $option2.textContent = 'Date'

    const $option3 = document.createElement('button')
    $option3.classList.add('sort-entry')
    $option3.id = 'titre'
    $option3.setAttribute('role', 'option')
    $option3.textContent = 'Titre'

    const $chevronUp = document.createElement('button')
    $chevronUp.classList.add('chevron', 'chevron-up')
    $chevronUp.setAttribute('type', 'button')
    $chevronUp.setAttribute('aria-label', 'Menu déroulant ouvert. Cliquez pour fermer le menu déroulant.')

    const $chevronUpIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $chevronUpIcon.classList.add('chevron-up-icon')
    $chevronUpIcon.setAttribute('viewBox', '0 0 512 512')
    $chevronUpIcon.setAttribute('fill', 'white')
    $chevronUpIcon.innerHTML = '<path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>'
    $chevronUpIcon.setAttribute('width', '24')
    $chevronUpIcon.setAttribute('height', '24')

    $chevronUp.appendChild($chevronUpIcon)

    $sortMenu.appendChild($chevronUp)
    $sortMenu.appendChild($option1)
    $sortMenu.appendChild($option2)
    $sortMenu.appendChild($option3)

    $chevronDown.appendChild($chevronDownIcon)

    $dropdown.appendChild($sortBy)
    $dropdown.appendChild($sortingDropdown)
    $dropdown.appendChild($chevronDown)
    $dropdown.appendChild($sortMenu)

    return $dropdown
  },

  initializeDropdown () {
    const $sortingDropdown = document.querySelector('.sortingDropdown')
    const $chevronDown = document.querySelector('.chevron-down')
    const $chevronUp = document.querySelector('.chevron-up')

    $sortingDropdown?.addEventListener('click', dropdown.dropdownClickHandler)
    $sortingDropdown?.addEventListener('keydown', dropdown.dropdownKeydownHandler)

    $chevronDown.addEventListener('click', dropdown.dropdownClickHandler)
    $chevronDown.addEventListener('keydown', dropdown.dropdownKeydownHandler)

    document.addEventListener('click', dropdown.documentClickHandler)
    document.addEventListener('keydown', dropdown.documentKeydownHandler)
    $chevronUp.addEventListener('click', dropdown.chevronUpClickHandler)
    $chevronUp.addEventListener('keydown', dropdown.chevronUpKeydownHandler)
  },

  dropdownClickHandler (event) {
    event.preventDefault()
    event.stopPropagation()
    dropdown.toggleDropdown(true)
  },

  dropdownKeydownHandler (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      dropdown.toggleDropdown(true)
    }
  },

  // Permet de fermer le menu déroulant si l'utilisateur clique en dehors de celui-ci
  documentClickHandler (event) {
    const $dropdown = document.querySelector('.dropdown')
    const isClickInside = $dropdown?.contains(event.target)

    if (!isClickInside && $dropdown.classList.contains('open')) {
      event.preventDefault()
      event.stopPropagation()
      dropdown.toggleDropdown(false)
    }
  },

  documentKeydownHandler (event) {
    const $dropdown = document.querySelector('.dropdown')

    if ($dropdown.classList.contains('open') && event.key === 'Escape') {
      dropdown.toggleDropdown(false)
    }
  },

  chevronUpClickHandler (event) {
    event.preventDefault()
    event.stopPropagation()
    dropdown.toggleDropdown(false)
  },

  chevronUpKeydownHandler (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      dropdown.toggleDropdown(false)
    }
  },

  toggleDropdown (isOpen) {
    const $dropdown = document.querySelector('.dropdown')
    const $sortingDropdown = document.querySelector('.sortingDropdown')
    const $sortMenu = document.getElementById('listbox')
    const $chevronDown = document.querySelector('.chevron-down')
    const $chevronUp = document.querySelector('.chevron-up')

    $dropdown.classList?.toggle('open', isOpen)
    $sortingDropdown?.setAttribute('aria-label', isOpen ? 'Menu déroulant ouvert. Vous pouvez trier les médias par plusieurs options.' : 'Menu déroulant fermé. Cliquez pour trier les médias par plusieurs options.')
    $sortingDropdown?.setAttribute('aria-expanded', isOpen.toString())
    $sortingDropdown?.setAttribute('aria-hidden', isOpen.toString())
    $chevronDown?.setAttribute('aria-hidden', (!isOpen).toString())
    $sortMenu?.setAttribute('aria-expanded', isOpen.toString())
    $sortMenu?.setAttribute('aria-hidden', (!isOpen).toString())
    $chevronUp?.setAttribute('aria-hidden', (!isOpen).toString())

    if (isOpen === true) {
      const $firstBouton = document.querySelector('.sort-entry')
      const $chevronUp = document.querySelector('.chevron-up')
      if ($firstBouton) {
        $firstBouton.focus()
      }
    } else {
      const $chevronDown = document.querySelector('.chevron-down')
      $chevronDown.focus()
    }
  },

  reorderButtonsBySort (sortOption) {
    const $sortMenu = document.getElementById('listbox')
    const $popularityButton = document.getElementById('popularité')
    const $dateButton = document.getElementById('date')
    const $titleButton = document.getElementById('titre')

    switch (sortOption) {
      case 'Popularité':
        $sortMenu.appendChild($dateButton)
        $sortMenu.appendChild($titleButton)
        break
      case 'Date':
        $sortMenu.appendChild($titleButton)
        $sortMenu.appendChild($popularityButton)
        break
      case 'Titre':
        $sortMenu.appendChild($popularityButton)
        $sortMenu.appendChild($dateButton)
        break
      default:
        console.error(`Unknown sort option: ${sortOption}`)
        break
    }
  }
}
