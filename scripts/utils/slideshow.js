const slideshow = {

  createSlideshow () {
    const $slideshowSection = document.createElement('section')
    $slideshowSection.classList.add('slideshow-modal')
    $slideshowSection.setAttribute('role', 'dialog')
    $slideshowSection.setAttribute('aria-labelledby', 'slideshowTitle')

    const $figure = document.createElement('figure')

    const $figcaption = document.createElement('figcaption')

    const $figureTitle = document.createElement('h3')
    $figureTitle.id = 'slideshowTitle'

    const $leftControl = document.createElement('button')
    $leftControl.classList.add('icon-control', 'left-control')
    $leftControl.setAttribute('type', 'button')
    $leftControl.setAttribute('role', 'link')
    $leftControl.setAttribute('aria-label', 'Image précédente')

    const $leftControlIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $leftControlIcon.classList.add('left-control-icon')
    $leftControlIcon.setAttribute('aria-hidden', 'true')
    $leftControlIcon.setAttribute('viewBox', '0 0 512 512')
    $leftControlIcon.innerHTML = '<path transform="translate(124, 0)" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>'

    const $rightControl = document.createElement('button')
    $rightControl.classList.add('icon-control', 'right-control')
    $rightControl.setAttribute('type', 'button')
    $rightControl.setAttribute('role', 'link')
    $rightControl.setAttribute('aria-label', 'Image suivante')

    const $rightControlIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $rightControlIcon.classList.add('right-control-icon')
    $rightControlIcon.setAttribute('aria-hidden', 'true')
    $rightControlIcon.setAttribute('viewBox', '0 0 512 512')
    $rightControlIcon.innerHTML = '<path transform="translate(62, 0)" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>'

    const $closeControl = document.createElement('button')
    $closeControl.id = 'close-control'
    $closeControl.setAttribute('role', 'link')
    $closeControl.setAttribute('type', 'button')
    $closeControl.classList.add('icon-control')
    $closeControl.setAttribute('aria-label', 'Fermer le diaporama')

    const $closeControlIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $closeControlIcon.classList.add('close-control-icon')
    $closeControlIcon.setAttribute('aria-hidden', 'true')
    $closeControlIcon.setAttribute('viewBox', '0 0 384 512')
    $closeControlIcon.innerHTML = '<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>'

    $figcaption.appendChild($figureTitle)
    $figure.appendChild($figcaption)

    $leftControl.appendChild($leftControlIcon)
    $rightControl.appendChild($rightControlIcon)
    $closeControl.appendChild($closeControlIcon)

    $slideshowSection.appendChild($leftControl)
    $slideshowSection.appendChild($figure)
    $slideshowSection.appendChild($rightControl)
    $slideshowSection.appendChild($closeControl)

    return $slideshowSection
  },

  toggleSlideshow () {
    const $mainContainer = document.querySelector('.main-container')
    const $modal = document.querySelector('.slideshow-modal')
    const isOpen = $modal.classList.toggle('open')

    if ($modal) {
      $mainContainer?.toggleAttribute('aria-hidden', isOpen)
      $mainContainer?.classList.toggle('slideshow-filter', isOpen)

      $modal.toggleAttribute('aria-hidden', !isOpen)
      $modal.toggleAttribute('aria-modal', isOpen)
      $modal.setAttribute('tabindex', '0')
      $modal.classList.toggle('isOpen', isOpen)

      if (isOpen) {
        this.lastFocusedElement = document.activeElement
        $modal.focus()

        const focusableElements = 'button'
        const focusableElementsInModal = Array.from($modal.querySelectorAll(focusableElements))
        const firstFocusableElement = focusableElementsInModal[0]
        const lastFocusableElement = focusableElementsInModal[focusableElementsInModal.length - 1]
        const handleKeydown = (event) => {
          this.handleTrapFocus(event, firstFocusableElement, lastFocusableElement)
        }
        $modal.removeEventListener('keydown', handleKeydown)
        $modal.addEventListener('keydown', handleKeydown)
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

  createSlideshowThumbnails () {
    const { type, src, alt, videoType } = this._media.mediaView || {}
    const $figure = document.querySelector('figure')
    const $figcaption = this.figure.querySelector('figcaption')

    // Create an img or video element based on the media type
    const $slideshowElement = type === 'img' ? document.createElement('img') : document.createElement('video')
    $slideshowElement.id = 'slide'
    $slideshowElement.classList.add(type === 'img' ? 'img-media' : 'video-media', this._mediaIdClass)
    $slideshowElement.src = src
    if (type === 'video') {
      $slideshowElement.type = videoType || 'video/mp4'
      $slideshowElement.controls = true
    }
    $slideshowElement.alt = 'Vue aggrandie du média : ' + alt

    const $figureTitle = document.querySelector('h3')
    $figureTitle.textContent = alt

    $figure.insertBefore($slideshowElement, $figcaption)

    // Create an object containing useful information about the media (thumbnail)
    const slideshowThumbnailInfo = {
      mediaId: this._mediaIdClass,
      src,
      alt,
      type,
      controls: true,
      videoType
    }

    return slideshowThumbnailInfo
  }
}

export default slideshow
