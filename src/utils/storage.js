class Storage {

  static setArea(value) {
    localStorage.setItem('area', JSON.stringify(value))
  }

  static getArea() {
    return JSON.parse(localStorage.getItem('area'))
  }
}

export default Storage
