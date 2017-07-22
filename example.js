const moment = require('moment');
const fs = require('fs');
const taxes = require('./taxes');
const nbu = require('./nbu');

function read(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(error, data) {
            if (error) { reject(error); }
            else { resolve(data.toString()); }
        });
    });
}

function fetchRates(payments) {
    return Promise.all(payments.map(nbu.fetchRate));
}

function parseDates(payments) {
    return payments.map(function(payment) {
        payment.date = moment(payment.date, 'DD.MM.YYYY');
        return payment;
    });
}

read('payments-example.json')
    .then(JSON.parse)
    .then(parseDates)
    .then(fetchRates)
    .then(taxes.totalIncome)
    .then(console.log, console.error);
