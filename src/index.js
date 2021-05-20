var ethUtil = require('@starcoin/stc-util')
var encoding = require('@starcoin/starcoin').encoding

function assert(val, msg) {
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
  const privKeyStr = this.privKey.toString('hex')
  const publicKeyStr = await ethUtil.privateToPublicED(this.privKey)
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
  // HD
  if (this.pubKey.length == 33) {
    // the original publicKey of hdkeyring's root hdkey is used for deriveChild, so we should keep it
    // instead of override it with the ed25519 publicKey
    // we calculate the ed25519 publicKey here, and get the address from it.
    return ethUtil.privateToPublicED(this.privKey)
      .then((pubKey) => {
        return ethUtil.publicToAddressED(pubKey)
      })
  }
  // Simple
  return ethUtil.publicToAddressED(this.pubKey)
}

Wallet.prototype.getReceiptIdentifier = function () {
  // HD
  if (this.pubKey.length == 33) {
    return ethUtil.privateToPublicED(this.privKey)
      .then((pubKey) => {
        return encoding.publicKeyToReceiptIdentifier(pubKey.toString('hex'))
      })
  }
  // Simple
  return Promise.resolve(encoding.publicKeyToReceiptIdentifier(this.getPublicKeyString()))
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
