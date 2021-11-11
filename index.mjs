/**
 * Create two accounts using the Algorand Wallet App.
 * Fund them with https://bank.testnet.algorand.network/
 * Create a file called secrets.js and copy content from secrets_template.js, fill in secrets info
 */

import { loadStdlib } from '@reach-sh/stdlib'
import * as backend from './build/index.main.mjs'
import { getAccount, getBalance } from './Account.mjs'
import { secrets } from './secrets.js'

// Connect to the TestNet node
const PROVIDER = 'TestNet'

const stdlib = loadStdlib(process.env)

async function setup() {
  try {
    console.log('Run on provider:', PROVIDER)
    stdlib.setProviderByName(PROVIDER)

    const accAlice = await getAccount({ stdlib, phrase: secrets.ALICE_ACCOUNT_PHRASE || '' })
    const accBob = await getAccount({ stdlib, phrase: secrets.BOB_ACCOUNT_PHRASE || '' })
    // console.log(accAlice, accBob)
    if (!accAlice || !accBob) {
      console.log('Unable to retrieve accounts')
      return { success: false }
    }

    const startBalanceAlice = await getBalance({ stdlib, acc: accAlice })
    const startBalanceBob = await getBalance({ stdlib, acc: accBob })
    console.log('Account balances. Alice:', startBalanceAlice, 'Bob:', startBalanceBob)
    if (startBalanceAlice < 1 || startBalanceBob < 1) {
      console.log('Accounts must be funded. Use https://bank.testnet.algorand.network/')
      return { success: false }
    }
    return { success: true, accAlice, accBob, startBalanceAlice, startBalanceBob }
  } catch (err) {
    console.log('Failed to run', err)
  }
  return { success: false }
}

async function run({ accAlice, accBob, startBalanceAlice, startBalanceBob }) {
  try {
    const ctcAlice = accAlice.deploy(backend)
    const ctcBob = accBob.attach(backend, ctcAlice.getInfo())

    const HAND = ['Rock', 'Paper', 'Scissors']
    const OUTCOME = ['Bob wins', 'Draw', 'Alice wins']
    const Player = (Who) => ({
      ...stdlib.hasRandom, // <--- new!
      getHand: () => {
        const hand = Math.floor(Math.random() * 3)
        console.log(`${Who} played ${HAND[hand]}`)
        return hand
      },
      seeOutcome: (outcome) => {
        console.log(`${Who} saw outcome ${OUTCOME[outcome]}`)
      },
    })

    await Promise.all([
      backend.Alice(ctcAlice, {
        ...Player('Alice'),
        wager: stdlib.parseCurrency(5),
      }),
      backend.Bob(ctcBob, {
        ...Player('Bob'),
        acceptWager: (amt) => {
          console.log(`Bob accepts the wager of ${fmt(amt)}.`)
        },
      }),
    ])

    const afterBalanceAlice = await getBalance(accAlice)
    const afterBalanceBob = await getBalance(accBob)

    console.log(`Alice went from ${startBalanceAlice} to ${afterBalanceAlice}.`)
    console.log(`Bob went from ${startBalanceBob} to ${afterBalanceBob}.`)
  } catch (err) {
    console.log('Failed to run', err)
    return { success: false }
  }

  return { success: true, startBalanceAlice, afterBalanceAlice, startBalanceBob, afterBalanceBob }
}


(async () => {
  const setupResponse = await setup()
  if (setupResponse.success) {
    console.log('Setup complete')
    /*const runResult = await run(setupResponse)
    if (runResult.success) {
      console.log('Done')
    } else {
      console.log('Failed to execute!')
    }*/
  } else {
    console.log('Setup failed!')
  }
})()