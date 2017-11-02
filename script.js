const axios = require('axios');
const transaction = require('./transaction');

const getPrice = (str) => {
  return parseFloat(str.split('$')[1].split(' ')[0].replace(/,/g, '.'), 10);
};

const handleTransaction = (response, state) => {
  const { id, content, links } = response.data;
  if (!state.ids.includes(id)) {
    state.ids.push(id);
    state.sum += getPrice(content);
    state.total += links.length;
    if (state.total === 0) {
      return console.log(`$${state.sum.toFixed(2).toString()}`);
    }
    for (let link of links) {
      axios.get(link)
        .then((resp) => {
          state.total -= 1;
          handleTransaction(resp, state);
        })
        .catch(err => console.log(err));
    }
  }
};

const getTransactionsSum = (url) => {
  axios.get(url)
    .then((resp) => {
      const state = { sum: 0, ids: [], total: 0 };
      handleTransaction(resp, state);
    })
    .catch(err => console.log(err));
}

getTransactionsSum(transaction);

