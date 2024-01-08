// main.js : Entry point of the application - Load the right page depending on the url path

const path = window.location.pathname

if (path.includes('index.html')) {
  import('./pages/App.js').then((module) => {
    const app = new module.App()
    app.init()
  })
} else if (path.includes('photographer.html')) {
  import('./pages/Portfolio.js').then((module) => {
    const portfolio = new module.Portfolio()
    portfolio.init(getIdFromUrl())
  })
}

const getIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  return parseInt(id) || null
}
