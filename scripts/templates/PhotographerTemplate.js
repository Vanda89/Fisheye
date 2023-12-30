/**
 * Class representing a Photographer Template.
 */
class PhotographerTemplate {
  /**
   * Constructor for the PhotographerTemplate class.
   * @param {Object} photographer - Photographer data.
   */
  constructor (photographer) {
    this._photographer = photographer
  }

  /**
   * Create the DOM structure for the photographer card.
   * @returns {HTMLElement} Photographer card element.
   */
  createPhotographerCardDOM () {
    const $container = document.createElement('article')

    const $link = document.createElement('a')
    $link.href = '#'
    $link.classList.add('portfolio-link', 'card-thumbnail')
    $link.dataset.photographerId = this._photographer.id
    $link.setAttribute('aria-label', `${this._photographer.name}`)

    const $thumbnailContainer = document.createElement('div')
    $thumbnailContainer.classList.add('thumbnail-container')
    const $thumbnail = document.createElement('img')
    $thumbnail.src = this._photographer.portrait
    $thumbnail.alt = `Portrait de ${this._photographer.name}`
    $thumbnailContainer.appendChild($thumbnail)
    $thumbnail.setAttribute('aria-hidden', 'true')

    const $name = document.createElement('h2')
    $name.textContent = this._photographer.name

    $link.appendChild($thumbnailContainer)
    $link.appendChild($name)

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

    $container.appendChild($link)
    $container.appendChild($cardContent)

    return $container
  }

  /**
   * Create the DOM structure for the photographer header.
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
    $contactButton.setAttribute('aria-label', `Contactez ${this._photographer.name}`)

    const $photographerThumbnail = document.createElement('div')
    $photographerThumbnail.classList.add('photograph-thumbnail')

    const $photographerImage = document.createElement('img')
    $photographerImage.src = this._photographer.portrait
    $photographerImage.alt = `Portrait de ${this._photographer.name}`

    $photographerThumbnail.appendChild($photographerImage)

    $photographerContainer.appendChild($photographerInfos)
    $photographerContainer.appendChild($contactButton)
    $photographerContainer.appendChild($photographerThumbnail)

    return $photographerContainer
  }

  /**
   * Create the DOM structure for the photographer info bar.
   * @returns {HTMLElement} Photographer info bar element.
   */
  createPhotographerInfoBar () {
    const $infoBar = document.createElement('aside')
    $infoBar.classList.add('info-bar')

    const $likesContainer = document.createElement('div')
    $likesContainer.classList.add('likes-container')

    const $likes = document.createElement('p')
    $likes.classList.add('likes-number')

    const $likesIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $likesIcon.classList.add('likes-icon')
    $likesIcon.setAttribute('viewBox', '0 0 512 512')
    $likesIcon.innerHTML = `
      <title>Icône de coeur rempli</title>
      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
    `
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

export default PhotographerTemplate
