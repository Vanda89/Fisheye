const slideshow = {

  createSlideshow () {
    const $slideshowSection = document.createElement('section')
    $slideshowSection.classList.add('slideshow-modal')
    $slideshowSection.setAttribute('role', 'dialog')
    $slideshowSection.setAttribute('aria-labelledby', 'slideshow')

    const $figure = document.createElement('figure')

    const $figcaption = document.createElement('figcaption')
    $figcaption.setAttribute('aria-labelledby', 'slide')
    $figcaption.setAttribute('describedby', 'slideshowTitle')

    const $figureTitle = document.createElement('h3')
    $figureTitle.id = 'slideshowTitle'

    const $leftControl = document.createElement('a')
    $leftControl.classList.add('icon-control', 'left-control')
    $leftControl.setAttribute('alt', 'Previous image')

    const $leftControlIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $leftControlIcon.classList.add('left-control-icon')
    $leftControlIcon.setAttribute('alt', 'Icône de flèche de gauche')
    $leftControlIcon.setAttribute('viewBox', '0 0 512 512')
    $leftControlIcon.setAttribute('aria-hidden', 'true')
    $leftControlIcon.innerHTML = '<path transform="translate(124, 0)" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>'

    const $rightControl = document.createElement('a')
    $rightControl.classList.add('icon-control', 'right-control')
    $rightControl.setAttribute('alt', 'Next image')

    const $rightControlIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $rightControlIcon.classList.add('right-control-icon')
    $rightControlIcon.setAttribute('alt', 'Icône de flèche de droite')
    $rightControlIcon.setAttribute('viewBox', '0 0 512 512')
    $rightControlIcon.setAttribute('aria-hidden', 'true')
    $rightControlIcon.innerHTML = '<path transform="translate(62, 0)" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>'

    const $closeControl = document.createElement('button')
    $closeControl.id = 'close-control'
    $closeControl.classList.add('icon-control')

    const $closeControlIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $closeControlIcon.classList.add('close-control-icon')
    $closeControlIcon.setAttribute('alt', 'Icône de croix')
    $closeControlIcon.setAttribute('viewBox', '0 0 384 512')
    $closeControlIcon.innerHTML = '<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>'

    $closeControl.appendChild($closeControlIcon)

    $rightControl.appendChild($rightControlIcon)

    $figcaption.appendChild($figureTitle)
    $figure.appendChild($figcaption)

    $leftControl.appendChild($leftControlIcon)

    $slideshowSection.appendChild($leftControl)
    $slideshowSection.appendChild($figure)
    $slideshowSection.appendChild($rightControl)
    $slideshowSection.appendChild($closeControl)

    return $slideshowSection
  },

  handleSlideshow (isopen) {
    const $mainContainer = document.querySelector('.main-container')
    const $modal = document.querySelector('.slideshow-modal')
    const $closeButton = document.getElementById('close-control')

    if ($modal) {
      $mainContainer?.toggleAttribute('aria-hidden', isopen)
      $mainContainer?.classList.toggle('slideshow-filter', isopen)

      $modal.toggleAttribute('aria-hidden', isopen)
      $modal.setAttribute('tabindex', '0')
      $modal.classList.toggle('isopening', isopen)

      if (isopen) {
        $closeButton?.focus()
      }
    }
  }
}

export default slideshow
