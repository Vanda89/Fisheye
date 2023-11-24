class Media {
  constructor (media, photographers) {
    this._id = media.id
    this._photographerId = media.photographerId
    this._title = media.title
    this._image = media.image
    this._video = media.video
    this._likes = media.likes
    this._date = media.date
    this._price = media.price
  }

  get id () {
    return this._id
  }

  get photographerId () {
    return this._photographerId
  }

  get title () {
    return this._title
  }

  get mediaView () {
    return this._image
      ? { type: 'img', src: `${this._image}`, alt: this._title }
      : { type: 'video', src: `${this._video}`, alt: this._title, videoType: 'video/mp4' }
  }

  get likes () {
    return this._likes
  }

  get date () {
    return this._date
  }

  get price () {
    return this._price
  }
}

class MediaFactory {
  createMedia (mediaData) {
    const media = new Media(mediaData)
    media.fullPath = `window.location.origin/assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`
    // console.log(media)
    return media
  }
}

export default MediaFactory
