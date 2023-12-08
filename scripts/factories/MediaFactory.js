/**
 * @typedef {Object} MediaData
 * @property {number} id
 * @property {number} photographerId
 * @property {string} title
 * @property {string} image
 * @property {string} video
 * @property {number} likes
 * @property {string} date
 * @property {number} price
 */

/**
 * @typedef {Object} MediaView
 * @property {string} type - Type of media ('img' for an image, 'video' for a video).
 * @property {string} src - Media source.
 * @property {string} alt - Alternative text for the media.
 * @property {string} [videoType] - Video type (only for videos).
 */

/**
 * Class representing a media (photo or video).
 */
class Media {
  /**
   * @param {MediaData} media - Media data.
   */
  constructor (media) {
    this._id = media.id
    this._photographerId = media.photographerId
    this._title = media.title
    this._image = media.image
    this._video = media.video
    this._likes = media.likes
    this._date = media.date
    this._price = media.price
  }

  /**
   * Media ID.
   * @type {number}
   */
  get id () {
    return this._id
  }

  /**
   * Photographer ID associated with the media.
   * @type {number}
   */
  get photographerId () {
    return this._photographerId
  }

  /**
   * Media title.
   * @type {string}
   */
  get title () {
    return this._title
  }

  /**
   * Media view as an object with properties specified in MediaView.
   * @type {MediaView}
   */
  get mediaView () {
    return this._image
      ? { type: 'img', src: `${this._image}`, alt: this._title }
      : { type: 'video', src: `${this._video}`, alt: this._title, videoType: 'video/mp4' }
  }

  /**
   * Number of likes for the media.
   * @type {number}
   */
  get likes () {
    return this._likes
  }

  /**
   * Date of media creation.
   * @type {string}
   */
  get date () {
    return this._date
  }

  /**
   * Price of the media.
   * @type {number}
   */
  get price () {
    return this._price
  }
}

/**
 * Factory for creating instances of the Media class and generating a full path for images.
 */
class MediaFactory {
  /**
   * Creates an instance of the Media class from media data and generates a full path for images.
   * @param {MediaData} mediaData - Media data.
   * @returns {Media} Instance of the Media class.
   */
  createMedia (mediaData) {
    const media = new Media(mediaData)
    media.fullPath = `window.location.origin/assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`
    // console.log(media)
    return media
  }
}

export default MediaFactory
