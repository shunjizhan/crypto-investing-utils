// referenced to https://github.com/bokub/vanity-eth

const secp256k1 = require('secp256k1');
const keccak = require('keccak');
const randomBytes = require('randombytes');

const privateToAddress = (privateKey) => {
  const pub = secp256k1.publicKeyCreate(privateKey, false).slice(1);
  return keccak('keccak256').update(pub).digest().slice(-20).toString('hex');
};

const getRandomAddress = () => {
  const randbytes = randomBytes(32);
  const private = privateToAddress(randbytes).toString('hex');
  const public = randbytes.toString('hex');

  return { private, public };
};

const getVanityAddress = (prefixs, suffixs) => {
  let x = 0;
  const p = new Set(prefixs);
  const s = new Set(suffixs);

  const TargetIteration = 5600000;

  while (true) {
    x++;
    if (x % 200000 === 0) {
      console.log(`${x / 1000}k address checked [${parseInt(x * 100 / TargetIteration)}%]`);
    }

    const {
      public: address,
      private: key,
    } = getRandomAddress();
    const prefix = address.slice(0, 4);
    const suffix = address.slice(address.length - 4);

    if (p.has(prefix) && s.has(suffix)) {
      console.log({ address, key });
    }
  }
};

const prefixs = [
  '0000',
  '1111',
  '2222',
  '3333',
  '5555',
  '6666',
  '7777',
  '8888',
  '9999',
  'aaaa',
  'bbbb',
  'cccc',
  'dddd',
  'eeee',
  'ffff',

  '1234',
  '2345',
  '3456',
  '4567',
  '5678',
  '6789',

  '9876',
  '8765',
  '7654',
  '6543',
  '5432',
  '4321',

  'shun',
  'haha',
];

const suffixs = prefixs;

getVanityAddress(prefixs, suffixs);

