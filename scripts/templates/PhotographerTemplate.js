/**
 * Class representing a Photographer Template.
 */
class PhotographerTemplate {
  /**
   * @param {Object} photographer - Photographer data.
   */
  constructor (photographer) {
    this._photographer = photographer
  }

  /**
   * Create the DOM structure for the photographer card on the homepage.
   * @returns {HTMLElement} Photographer card element.
   */
  createPhotographerCardDOM () {
    const $container = document.createElement('article')

    const $portfolioLink = document.createElement('div')
    $portfolioLink.classList.add('portfolio-link', 'card-thumbnail')
    $portfolioLink.dataset.photographerId = this._photographer.id
    $portfolioLink.setAttribute('aria-label', `Aller à la page de portfolio du photographe ${this._photographer.name}`)
    $portfolioLink.tabIndex = 0
    $portfolioLink.setAttribute('role', 'link')

    const $thumbnailContainer = document.createElement('div')
    $thumbnailContainer.classList.add('thumbnail-container')

    const $thumbnail = document.createElement('img')
    $thumbnail.src = this._photographer.portrait
    $thumbnail.alt = `Portrait de ${this._photographer.name}`
    $thumbnail.width = 200
    $thumbnail.height = 200

    $thumbnailContainer.appendChild($thumbnail)

    const $name = document.createElement('h2')
    $name.textContent = this._photographer.name
    $name.setAttribute('aria-label', `Nom du photographe: ${this._photographer.name}`)

    $portfolioLink.appendChild($thumbnailContainer)
    $portfolioLink.appendChild($name)

    const $cardContent = document.createElement('div')
    $cardContent.classList.add('card-content')

    const $location = document.createElement('p')
    $location.classList.add('location')
    $location.textContent = this._photographer.location
    $location.setAttribute('aria-label', `Localisation: ${this._photographer.location}`)

    const $tagline = document.createElement('p')
    $tagline.classList.add('tagline')
    $tagline.textContent = this._photographer.tagline
    $tagline.setAttribute('aria-label', `Slogan: ${this._photographer.tagline}`)

    const $price = document.createElement('p')
    $price.classList.add('price')
    $price.textContent = this._photographer.price
    $price.setAttribute('aria-label', `Prix: ${this._photographer.price}`)

    $cardContent.appendChild($location)
    $cardContent.appendChild($tagline)
    $cardContent.appendChild($price)

    $container.appendChild($portfolioLink)
    $container.appendChild($cardContent)

    return $container
  }

  /**
   * Create the DOM structure for the photographer header on the portfolio page.
   * @returns {HTMLElement} Photographer header element.
   */
  createPhotographerContainerDOM () {
    const $photographerContainer = document.createElement('section')
    $photographerContainer.classList.add('photographer-container')

    const $photographerInfos = document.createElement('div')
    $photographerInfos.classList.add('photograph-infos')

    const $photographerName = document.createElement('h1')
    $photographerName.classList.add('photograph-name')
    $photographerName.textContent = this._photographer.name

    const $photographerLocation = document.createElement('p')
    $photographerLocation.classList.add('photograph-location')
    $photographerLocation.textContent = this._photographer.location

    const $photographerTagline = document.createElement('p')
    $photographerTagline.classList.add('photograph-tagline')
    $photographerTagline.textContent = this._photographer.tagline

    $photographerInfos.appendChild($photographerName)
    $photographerInfos.appendChild($photographerLocation)
    $photographerInfos.appendChild($photographerTagline)

    const $contactButton = document.createElement('button')
    $contactButton.classList.add('contact-button')
    $contactButton.textContent = 'Contactez-moi'
    $contactButton.setAttribute('aria-label', `Contactez ${this._photographer.name} en ouvrant le formulaire`)

    const $photographerThumbnail = document.createElement('div')
    $photographerThumbnail.classList.add('photograph-thumbnail')

    const $photographerImage = document.createElement('img')
    $photographerImage.src = this._photographer.portrait
    $photographerImage.alt = `Portrait de ${this._photographer.name}`
    $photographerImage.width = 200
    $photographerImage.height = 200

    $photographerThumbnail.appendChild($photographerImage)

    $photographerContainer.appendChild($photographerInfos)
    $photographerContainer.appendChild($contactButton)
    $photographerContainer.appendChild($photographerThumbnail)

    return $photographerContainer
  }

  /**
   * Create the DOM structure for the photographer info bar on the portfolio page.
   * @returns {HTMLElement} Photographer info bar element.
   */
  createPhotographerInfoBar () {
    const $infoBar = document.createElement('aside')
    $infoBar.classList.add('info-bar')

    const $likesContainer = document.createElement('div')
    $likesContainer.classList.add('likes-container')

    const $likes = document.createElement('p')
    $likes.classList.add('likes-number')
    $likes.setAttribute('aria-live', 'polite')
    $likes.setAttribute('aria-label', 'Nombre total de likes pour ' + this._photographer.name)

    const $likesIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $likesIcon.classList.add('likes-icon')
    $likesIcon.setAttribute('viewBox', '0 0 512 512')
    $likesIcon.innerHTML = `
      <title>Icône de coeur rempli</title>
      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
    `
    $likesIcon.setAttribute('aria-hidden', 'true')
    $likesIcon.setAttribute('aria-label', 'Nombre total de likes pour ' + this._photographer.name)
    $likesIcon.setAttribute('width', '24')
    $likesIcon.setAttribute('height', '24')

    $likesContainer.appendChild($likes)
    $likesContainer.appendChild($likesIcon)

    const $priceContainer = document.createElement('div')
    $priceContainer.classList.add('price-container')
    $priceContainer.textContent = this._photographer.price

    $infoBar.appendChild($likesContainer)
    $infoBar.appendChild($priceContainer)

    return $infoBar
  }
}
