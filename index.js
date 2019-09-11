const { extractText } = require('doxtract');

if (process.argv.length <= 2) {
  console.log(`Usage: ${__filename} path/to/doc`);
  process.exit(-1);
}

function countWords(text) {
  return new Promise((resolve, reject) => {
    const word = new RegExp(/\b(\w{2,})\b/, 'gmi');
    const allWords = text.match(word);
    if (!allWords) {
      reject(new Error('File is empty'));
    }
    try {
      resolve(allWords.length);
    } catch (err) {
      reject(err);
    }
  });
}

const estimates = {
  5999: [0.78, '3-4'],
  9999: [0.89, '4-6'],
  10001: [0.99, '7-12'],
};

function calcEstimates(count) {
  return new Promise((resolve, reject) => {
    if (count < 1) {
      reject(new Error('Text is not long enough'));
    }
    try {
      for (let key of Object.keys(estimates)) {
        if (count < +key) {
          let price = Math.round(count * +estimates[key][0]);
          resolve(`$${price} MXN`);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

const doc = process.argv[2];
extractText(doc)
  .then(text => countWords(text))
  .then(count => calcEstimates(count))
  .then(estimate => console.log(estimate))
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });
