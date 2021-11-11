export async function getAccount({ stdlib, phrase }) {
  let acc = null
  try {
    if (!phrase || phrase === '') {
      console.log('GetAccounts failed, invalid phrase')
      return null
    }
    acc = await stdlib.newAccountFromMnemonic(phrase);
    const accBigNumber = await stdlib.balanceOf(acc)
    const accBalance = stdlib.bigNumberToNumber(accBigNumber)
    // console.log('accBalance', accBalance)
  } catch (err) {
    console.log('GetAccounts failed', err)
  }
  return acc
}

export async function getBalance({ stdlib, acc }) {
  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const balance = await stdlib.balanceOf(acc)
  return fmt(balance)
}

// Untested...
// newTestAccount only works on private nets.
export async function GetTestAccount({ stdlib }) {
  const acc = await stdlib.newTestAccount(startingBalance)
  const canFundFromFaucet = await stdlib.canFundFromFaucet()
  if (!canFundFromFaucet) {
    console.log('Unable to fund accounts from Faucet... note only works on private nets (e.g. devnet).')
    return null
  }
  await stdlib.fundFromFaucet(acc, 100)
  return acc
}