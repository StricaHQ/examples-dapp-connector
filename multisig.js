const cbors = require('@stricahq/cbors');
const bip32ed25519 = require('@stricahq/bip32ed25519');
const typhonjs = require('@stricahq/typhonjs');

const transactionCbor = Buffer.from("CBOR_STRING", 'hex');

const decodedTx = cbors.Decoder.decode(transactionCbor).value;

const txBody = decodedTx[0];
const txBodyByteSpan = txBody.getByteSpan();

const txBytes = transactionCbor.slice(txBodyByteSpan[0], txBodyByteSpan[1]);

const txHash = typhonjs.crypto.hash32(txBytes);


// prepare witness
const privateKey = new bip32ed25519.PrivateKey(PRIVATE_KEY); // or derive from mnemonic


const publicKey = privateKey.toPublicKey().toBytes();
const signature = privateKey.sign(txHash);

const witness = [publicKey, signature];

// add witness to the original transaction
const existingWitnesses = decodedTx[1].get(0);
existingWitnesses.push(witness);
decodedTx[1].set(0, existingWitnesses);

const updatedTxCbor = cbors.Encoder.encode(decodedTx);

// the final tx cbor
console.log(updatedTxCbor.toString('hex'));
