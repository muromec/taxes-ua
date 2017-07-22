const fetch = require('node-fetch');

function fetchRate(payment) {
    if (payment.rate || payment.currency === 'UAH') {
        return payment;
    }
    const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange' +
        '?valcode=' + payment.currency +
        '&date=' +  payment.date.format('YYYYMMDD') +
        '&json'
    return fetch(url)
        .then(function (response) { return response.text(); })
        .then(function (text) {
            const data = JSON.parse(text)[0];
            payment.rate = data.rate;
            return payment;
        });
}

module.exports = {fetchRate};
