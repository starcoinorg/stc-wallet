var assert = require('assert')
var Buffer = require('safe-buffer').Buffer
var Wallet = require('../')
var Thirdparty = require('../thirdparty.js')
var ethUtil = require('@starcoin/stc-util')

var fixturePrivateKey = 'c228177c66fb41eb5d1f909966b188d8accdd1dda8f33ab064d1dddc71b78eb6'
var fixturePrivateKeyStr = '0x' + fixturePrivateKey
var fixturePrivateKeyBuffer = Buffer.from(fixturePrivateKey, 'hex')

var fixturePublicKey = 'ebbcaeafc931beee008e7a8b2ac8fbc51ef0d0c46090d654f113253f699ced40'
var fixturePublicKeyStr = '0x' + fixturePublicKey
var fixturePublicKeyBuffer = Buffer.from(fixturePublicKey, 'hex')

var fixtureAddressKey = 'b2c4c079d0e139ec8833ea00e80bb21b'
var fixtureAddressKeyStr = '0x' + fixtureAddressKey

var fixtureWallet = Wallet.fromPrivatePublic(fixturePrivateKeyBuffer, fixturePublicKeyBuffer)

describe('.getPrivateKey()', function () {
  it('should work', function () {
    assert.strictEqual(fixtureWallet.getPrivateKey().toString('hex'), fixturePrivateKey)
  })
})

describe('.getPrivateKeyString()', function () {
  it('should work', function () {
    assert.strictEqual(fixtureWallet.getPrivateKeyString(), fixturePrivateKeyStr)
  })
})

describe('.getPublicKey()', function () {
  it('should work', function () {
    const publicKey = fixtureWallet.getPublicKey()
    assert.strictEqual(publicKey.toString('hex'), fixturePublicKey)
  })
})

describe('.getPublicKeyString()', function () {
  it('should work', function () {
    const publicKeyString = fixtureWallet.getPublicKeyString()
    assert.strictEqual(publicKeyString, fixturePublicKeyStr)
  })
})

describe('.getAddress()', function () {
  it('should work', function () {
    const address = fixtureWallet.getAddress()
    assert.strictEqual(address.toString('hex'), fixtureAddressKey)
  })
})

describe('.getAddressString()', function () {
  it('should work', function () {
    assert.strictEqual(fixtureWallet.getAddressString(), fixtureAddressKeyStr)
  })
})

describe('.checkValidPublicKey()', function () {
  it('should work', async function () {
    const result = await fixtureWallet.checkValidPublicKey()
    assert.strictEqual(result, true)
  })
})

describe('raw new Wallet() init', function () {
  it('should ok when both priv and pub key provided', async function () {
    const wallet = new Wallet(fixturePrivateKeyBuffer, fixturePublicKeyBuffer)
    const result = await wallet.checkValidPublicKey()
    assert.strictEqual(result, true)
  })
})

