const path      = require('path')
const Utils     = require('../../Utils')
const _config   = require('../../config/config')
const puppeteer = require('puppeteer')

let page    = false
let browser = false

beforeAll(async () => {
  browser = await puppeteer.launch(_config.puppeterBrowserConfig)
  page    = await browser.newPage()

  Utils.exitListener(() => {
    page.close()
    browser.close()
    process.exit(130)
  })

  page.on('console', (msg) => { console.log(1) })
  page.on('pageerror', (exceptionMessage) => { console.log(exceptionMessage); })

  await page.goto(`file://${path.join(__dirname, '../dapp')}/index.html`)
  await page.waitForSelector('#content')
  await page.reload()
})

afterAll(() => {
  browser.close()
})


describe('Test: Invalid deposit', () => {
  test('Connect', async done => {
    try {
      await page.evaluate(() => {
        return new Promise((resolve, reject) => {
          window.Dice.connect({
            bankroller: 'auto',
            paychannel: { deposit: 'sss' },
            gamedata: []
          }, (connection, info) => {
            const result = { connection: connection, info: info }
            resolve(result)
          })
        })
      })
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      done()
    }
  })
})