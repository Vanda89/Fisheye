document.addEventListener('DOMContentLoaded', (event) => {
  dropdown.createDropdown()
})

const dropdown = {

  createDropdown () {
    const $dropdown = document.createElement('div')
    $dropdown.classList.add('dropdown')

    const $label = document.createElement('label')
    $label.id = 'sortingDropdownLabel'
    $label.classList.add('sortingDropdown-trigger')
    $label.textContent = 'Trier par'

    const $buttonDropdown = document.createElement('button')
    $buttonDropdown.id = 'sortingDropdown'
    $buttonDropdown.classList.add('sortingDropdown')
    $buttonDropdown.textContent = ''
    $buttonDropdown.setAttribute('role', 'button')
    $buttonDropdown.setAttribute('aria-labelledby', 'sortingDropdownLabel')
    $buttonDropdown.setAttribute('aria-haspopup', 'listbox')
    $buttonDropdown.setAttribute('aria-expanded', 'false')

    const $chevronDown = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $chevronDown.classList.add('chevron')
    $chevronDown.setAttribute('viewBox', '0 0 512 512')
    $chevronDown.setAttribute('fill', 'white')
    $chevronDown.setAttribute('aria-label', 'Ouvrir le menu déroulant')
    $chevronDown.innerHTML = '<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>'

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

    const $chevronUp = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $chevronUp.classList.add('chevron')
    $chevronUp.setAttribute('aria-label', 'Menu déroulant ouvert')
    $chevronUp.setAttribute('viewBox', '0 0 512 512')
    $chevronUp.setAttribute('fill', 'white')
    $chevronUp.innerHTML = '<path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>'

    $sortMenu.appendChild($option1)
    $sortMenu.appendChild($chevronUp)
    $sortMenu.appendChild($option2)
    $sortMenu.appendChild($option3)

    $dropdown.appendChild($chevronDown)
    $dropdown.appendChild($label)
    $dropdown.appendChild($buttonDropdown)
    $dropdown.appendChild($sortMenu)

    return $dropdown
  },

  toggleDropdown (isOpen) {
    const $dropdown = document.querySelector('.dropdown')
    const $sortingDropdown = document.querySelector('.sortingDropdown')
    const $sortMenu = document.getElementById('listbox')

    $dropdown.classList?.toggle('open', isOpen)
    $sortingDropdown?.setAttribute('aria-expanded', isOpen.toString())
    $sortMenu?.setAttribute('aria-expanded', isOpen.toString())

    if (isOpen) {
      $sortingDropdown?.addEventListener('click', this.sortingDropdownClickHandler)
      $sortingDropdown?.addEventListener('keydown', this.sortingDropdownKeydownHandler)
      document.addEventListener('click', this.documentClickHandler)
      document.addEventListener('keydown', this.documentKeydownHandler)
    } else {
      $sortingDropdown?.removeEventListener('click', this.sortingDropdownClickHandler)
      $sortingDropdown?.removeEventListener('keydown', this.sortingDropdownKeydownHandler)
      document.removeEventListener('click', this.documentClickHandler)
      document.removeEventListener('keydown', this.documentKeydownHandler)
    }
  },

  sortingDropdownClickHandler (event) {
    event.preventDefault()
    event.stopPropagation()
    dropdown.toggleDropdown(true)
  },

  sortingDropdownKeydownHandler (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      dropdown.toggleDropdown(true)
    }
  },

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
    if (event.key === 'Tab') {
      const $dropdown = document.querySelector('.dropdown')
      const focusableElements = $dropdown.querySelectorAll('button')
      const lastFocusableElement = focusableElements[focusableElements.length - 1]

      if (document.activeElement === lastFocusableElement && $dropdown.classList.contains('open')) {
        event.preventDefault()
        event.stopPropagation()
        dropdown.toggleDropdown(false)
      }
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

export default dropdown
