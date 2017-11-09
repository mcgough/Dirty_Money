const axios = require('axios');
const transaction = require('./transaction');

const getPrice = (str) => {
  return parseFloat(str.split('$')[1].split(' ')[0].replace(/,/g, '.'), 10);
};

const resolveResponse = (response) => {
  if (Object.prototype.hasOwnProperty.call(response, 'data')) {
    let { id, content, links } = response.data;
    return { id, content, links};
  } else {
    let { id, content, links } = response;
    return { id, content, links };
  }
};

const logResult = (sum) => {
  return console.log(`$${sum.toFixed(2).toString()}`);
};

const handleTransaction = ( response, state = null) => {
  const { id, content, links} = resolveResponse(response);

  if (!state) {
    state = { sum: 0, ids: [], total: 0 };
  }

  if (!state.ids.includes(id)) {
    state.ids = [...state.ids, id];
    state.sum += getPrice(content);
    state.total += links.length;
    if (state.total === 0) {
      return logResult(state.sum);
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

handleTransaction(transaction);



