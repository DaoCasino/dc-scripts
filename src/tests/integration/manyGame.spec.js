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

afterAll(() => {
  browser.close()
})


describe('Test: Many games', () => {
  test('Connect', async done => {
    const connect = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.Dice.connect({
          bankroller: 'auto',
          paychannel: { deposit: 20 },
          gamedata: []
        }, (connection, info) => {
          const result = { connection: connection, info: info }
          resolve(result)
        })
      })
    })

    expect(connect).toBeDefined()
    expect(connect).toHaveProperty('connection')
    expect(connect).toHaveProperty('info')
    expect(connect.connection).toBe(true)

    done()
  })

  test('Game', async done => {
    const values = [
      { bet: 1, num: Utils.randomInteger(1, 65530) },
      { bet: 1, num: Utils.randomInteger(1, 65530) },
      { bet: 2, num: Utils.randomInteger(1, 65530) },
      { bet: 1, num: Utils.randomInteger(1, 65530) },
      { bet: 2, num: Utils.randomInteger(1, 65530) },
      { bet: 1, num: Utils.randomInteger(1, 65530) },
      { bet: 3, num: Utils.randomInteger(1, 65530) },
      { bet: 1, num: Utils.randomInteger(1, 65530) },
      { bet: 1, num: Utils.randomInteger(1, 65530) },
      { bet: 3, num: Utils.randomInteger(1, 65530) }
    ]
    
    for (let value of values) {
      const game = await page.evaluate((bet, num) => {
        return new Promise((resolve, reject) => {
          const randomHash = window.DCLib.randomHash({ bet: bet, gamedata: [num] })
  
          window.Dice.Game(bet, num, randomHash)
            .then(res => {
              resolve(res)
            })
        })
      }, value.bet, value.num)
  
      expect(game).toBeDefined()
      expect(game).toHaveProperty('bankroller')
      expect(game).toHaveProperty('local')
      expect(game.local.args.length).toBe(3)
      expect(game.local.args[0]).toBe(value.bet)
      expect(game.local.args[1]).toBe(value.num)
    }

    done()
  })

  test('Disconnect', async done => {
    const disconnect = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.Dice.disconnect(res => {
          resolve(res)
        })
      })
    })

    expect(disconnect).toBeDefined()
    expect(disconnect).toHaveProperty('channel')
    expect(disconnect).toHaveProperty('connection')
    expect(disconnect.channel.status).toBe('ok')
    expect(disconnect.connection.disconnected).toBe(true)
    done()
  })
})