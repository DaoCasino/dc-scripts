const path      = require('path')
const Utils     = require('../../Utils')
const puppeteer = require('puppeteer')

let page    = false
let browser = false

beforeAll(async () => {
  browser = await puppeteer.launch(Utils.browserConfig)
  page    = await browser.newPage()

  page.on('console', (msg) => { console.log(1) })
  page.on('pageerror', (exceptionMessage) => { console.log(exceptionMessage); })

  process.on('SIGINT', () => {
    browser.close()
    process.exit(130)
  })

  await page.goto(`file://${path.join(__dirname, '../dapp')}/index.html`)
  await page.waitForSelector('#content')
  await page.reload()
})

afterAll(async () => {
  await page.close()
  await browser.close()
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
      console.log(11111111111111, err)
      expect(err).toBeInstanceOf(Error)
      done()
    }
  })
})