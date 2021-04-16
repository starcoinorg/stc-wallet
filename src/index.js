var ethUtil = require('@starcoin/stc-util')

function assert (val, msg) {
  if (!val) {
    throw new Error(msg || 'Assertion failed')
  }
}

var Wallet = function (priv, pub) {
  // because ed.getPublicKey is an async function,
  // so we have to generate the publicKey in ui and provide it directly to the constructor.
  // otherwise we have to change every place that w.getAddress is used, from sync call to .then() or async/await
  // and follow up the call chain among a lot of dependency npm packages.

  // if (priv && pub) {
  //   throw new Error('Cannot supply both a private and a public key to the constructor')
  // }

  // if (priv && !ethUtil.isValidPrivate(priv)) {
  //   throw new Error('Private key does not satisfy the curve requirements (ie. it is invalid)')
  // }
  //
  // if (pub && !ethUtil.isValidPublic(pub)) {
  //   throw new Error('Invalid public key')
  // }

  this._privKey = priv
  this._pubKey = pub
}

Object.defineProperty(Wallet.prototype, 'privKey', {
  get: function () {
    assert(this._privKey, 'This is a public key only wallet')
    return this._privKey
  }
})

Object.defineProperty(Wallet.prototype, 'pubKey', {
  get: function () {
    assert(this._pubKey, 'This is a private key only wallet')
    return this._pubKey
  }
})

Wallet.prototype.checkValidPublicKey = async function () {
  console.log('checkValidPublicKey', this.pubKey.length)
  if (this.pubKey.length !== 32) {
    return true
  }
  const privKeyStr = this.privKey.toString('hex')
  console.log('privKeyStr', privKeyStr)
  const publicKeyStr = await ethUtil.privateToPublicED(this.privKey)
  console.log('publicKeyStr', publicKeyStr)
  console.log(this.pubKey.toString('hex'))
  return this.pubKey.toString('hex') === publicKeyStr.toString('hex')
}

Wallet.prototype.getPrivateKey = function () {
  return this.privKey
}

Wallet.prototype.getPrivateKeyString = function () {
  return ethUtil.bufferToHex(this.getPrivateKey())
}

Wallet.prototype.getPublicKey = function () {
  return this.pubKey
}

Wallet.prototype.getPublicKeyString = function () {
  return ethUtil.bufferToHex(this.getPublicKey())
}

Wallet.prototype.getAddress = function () {
  console.log('getAddress', this.pubKey.length, this.pubKey.toString('hex'))
  if (this.pubKey.length === 32) {
    return ethUtil.publicToAddressED(this.pubKey)
  }
  return ethUtil.publicToAddress(this.pubKey)
}

Wallet.prototype.getAddressString = function () {
  return ethUtil.bufferToHex(this.getAddress())
}

Wallet.prototype.getChecksumAddressString = function () {
  return ethUtil.toChecksumAddress(this.getAddressString())
}

Wallet.fromPrivatePublic = function (priv, pub) {
  return new Wallet(priv, pub)
}

module.exports = Wallet
