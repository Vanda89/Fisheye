document.addEventListener('DOMContentLoaded', (event) => {
  dropdown.createDropdown()
})

const dropdown = {

  createDropdown () {
    // Creating the main container
    const $dropdown = document.createElement('div')
    $dropdown.classList.add('dropdown')

    // Creating the label
    const $label = document.createElement('label')
    $label.setAttribute('for', 'sortingDropdown')
    $label.classList.add('sortingDropdown-trigger')
    $label.setAttribute('aria-labelledby', 'Order by')
    $label.textContent = 'Trier par'

    // Creating the select
    const $buttonDropdown = document.createElement('button')
    $buttonDropdown.id = 'sortingDropdown'
    $buttonDropdown.classList.add('sortingDropdown')
    $buttonDropdown.textContent = ''
    $buttonDropdown.setAttribute('role', 'button')
    $buttonDropdown.setAttribute('aria-haspopup', 'listbox')
    $buttonDropdown.setAttribute('aria-expanded', 'false')

    const $chevronDown = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $chevronDown.classList.add('chevron')
    $chevronDown.setAttribute('viewBox', '0 0 512 512')
    $chevronDown.setAttribute('fill', 'white')
    $chevronDown.setAttribute('aria-label', 'Ouvrir le menu déroulant')
    $chevronDown.innerHTML = '<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>'

    // Creating the container for the sorting list
    const $sortMenu = document.createElement('div')
    $sortMenu.id = 'listbox'
    $sortMenu.setAttribute('role', 'listbox')
    $sortMenu.setAttribute('aria-activedescendant', 'firstchoice')
    $sortMenu.setAttribute('aria-labelledby', 'sortingDropdown')
    $sortMenu.setAttribute('aria-expanded', 'true')

    // Creating and adding sorting buttons
    const $option1 = document.createElement('button')
    $option1.classList.add('sort-entry')
    $option1.id = 'popularity'
    $option1.setAttribute('role', 'option')
    $option1.setAttribute('aria-label', 'Trier par popularité')
    $option1.setAttribute('data-id', 'popularity')
    $option1.textContent = 'Popularité'

    const $option2 = document.createElement('button')
    $option2.classList.add('sort-entry')
    $option2.id = 'date'
    $option2.setAttribute('role', 'option')
    $option2.setAttribute('aria-label', 'Trier par date')
    $option2.setAttribute('data-id', 'date')
    $option2.textContent = 'Date'

    const $option3 = document.createElement('button')
    $option3.classList.add('sort-entry')
    $option3.id = 'title'
    $option3.setAttribute('role', 'option')
    $option3.setAttribute('aria-label', 'Trier par titre')
    $option3.setAttribute('data-id', 'title')
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

    // Adding created elements to the main container
    $dropdown.appendChild($chevronDown)
    $dropdown.appendChild($label)
    $dropdown.appendChild($buttonDropdown)
    $dropdown.appendChild($sortMenu)

    return $dropdown
  },

  toggleDropdown (isOpen) {
    const $dropdown = document.querySelector('.dropdown')
    $dropdown.classList.toggle('open', isOpen)
  },

  reorderButtonsBySort (sortOption) {
    const $sortMenu = document.getElementById('listbox')
    const $popularityButton = document.getElementById('popularity')
    const $dateButton = document.getElementById('date')
    const $titleButton = document.getElementById('title')

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
