/**
 *
 */
class MediaTemplate {
  /**
   * Constructor for the MediaTemplate class.
   * @param {Object} media - Media data.
   */
  constructor (media) {
    this._media = media
    this.figure = document.createElement('figure')
    this._mediaIdClass = `media-${this._media.id}`
  }

  /**
 * Information about a media thumbnail.
 * @typedef {Object} mediaThumbnailInfo
 * @property {HTMLElement} figure - The figure element.
 * @property {string} mediaId - The media ID class.
 * @property {string} src - The source of the media.
 * @property {string} alt - The alternative text for the media.
 * @property {string} type - The type of media ('img' for an image, 'video' for a video).
 * @property {string} videoType - The video type (only for videos).
 */

  /**
 * Create a media thumbnail.
 * @returns {Object|null} Media thumbnail information or null if an error occurs.
 */
  createMediaThumbnail () {
    // object mediaView = the type of media, the src, the alt and the video type if the media is video
    if (!this._media || !this._media.mediaView) {
      console.error('Error: "mediaView" property not defined in media data.')
      return null
    }

    const { type, src, alt, videoType } = this._media.mediaView || {}
    const $figcaption = this.figure.querySelector('figcaption')

    // Create an img or video element based on the media type
    const $mediaElement = type === 'img' ? document.createElement('img') : document.createElement('video')
    $mediaElement.id = 'thumbnail'
    $mediaElement.classList.add(type === 'img' ? 'img-media' : 'video-media', this._mediaIdClass)
    $mediaElement.src = src
    if (type === 'video') {
      $mediaElement.type = videoType || 'video/mp4'
    }
    $mediaElement.alt = alt

    this.figure.insertBefore($mediaElement, $figcaption)

    // Create an object containing useful information about the media (thumbnail)
    const mediaThumbnailInfo = {
      figure: this.figure,
      mediaId: this._mediaIdClass,
      src,
      alt,
      type,
      videoType
    }

    return mediaThumbnailInfo
  }

  /**
   * Set media likes for the figure.
   * @returns {Object} Media likes information.
   */
  setMediaLikes () {
    this.figure.classList.add(this._mediaIdClass)

    const mediaLikes = { figure: this.figure, mediaCardId: this._mediaIdClass }
    return mediaLikes
  }

  /**
   * Create the DOM structure for the media card.
   * @returns {HTMLElement} Media card element.
   */
  createMediaCardDOM () {
    const $card = document.createElement('article')

    this.figure.classList.add('card-content')

    const $figcaption = document.createElement('figcaption')

    const $title = document.createElement('h2')
    $title.textContent = this._media.title

    const $cardLikes = document.createElement('div')
    $cardLikes.classList.add('card-likes')

    const $likesNumber = document.createElement('p')
    $likesNumber.classList.add('card-likes-number')
    $likesNumber.textContent = this._media.likes

    const $cardLikesIcons = document.createElement('div')
    $cardLikesIcons.classList.add('card-likes-icons')
    $cardLikesIcons.classList.toggle('liked', this._media.isLiked)
    $cardLikesIcons.setAttribute('role', 'button')
    $cardLikesIcons.setAttribute('tabindex', '0')
    $cardLikesIcons.setAttribute('aria-label', 'Aimer ce média')

    const $emptyHeartIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $emptyHeartIcon.classList.add('empty-heart-icon')
    $emptyHeartIcon.setAttribute('alt', 'Icône de coeur vide')
    $emptyHeartIcon.setAttribute('viewBox', '0 0 512 512')
    $emptyHeartIcon.innerHTML =
      '<path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>'

    const $heartIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    $heartIcon.classList.add('heart-icon')
    $heartIcon.setAttribute('alt', 'Icône de coeur plein')
    $heartIcon.setAttribute('viewBox', '0 0 512 512')
    $heartIcon.innerHTML = '<path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>'

    $cardLikesIcons.appendChild($emptyHeartIcon)
    $cardLikesIcons.appendChild($heartIcon)

    $cardLikes.appendChild($likesNumber)
    $cardLikes.appendChild($cardLikesIcons)

    $figcaption.appendChild($title)
    $figcaption.appendChild($cardLikes)

    this.figure.appendChild($figcaption)
    $card.appendChild(this.figure)

    return $card
  }
}

export default MediaTemplate
