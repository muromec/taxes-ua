function positive(amount) {
    return amount > 0 ? amount : 0;
}

function round(value, digits) {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
}

function popBalance(payment, balance) {
    const last = balance.pop();
    if (last.sum > payment.sum) {
        last.sum -= payment.sum;
        balance.push(last);
    }
    else if (last.sum < payment.sum) {
        payment.sum -= last.sum;
        return positive(
            round(last.sum * payment.rate, 2) -
            round(last.sum * last.rate, 2)
        ) + popBalance(payment, balance);
    }

    return positive(
        round(payment.sum * payment.rate, 2) -
        round(payment.sum * last.rate, 2)
    );
}


function value(payment, balance) {
    if (payment.type === 'exchange') {
        return popBalance(payment, balance);
    }

    if (payment.currency !== 'UAH') {
        balance.push(payment);
    }

    return round(
        payment.currency === 'UAH'
            ? payment.sum
            : payment.sum * payment.rate,
        2
    );
}

function quarter(payment) {
    const q = Math.floor(payment.date.month() / 3) + 1;
    return payment.date.year() + 'Q' + q;
}

function totalIncome(payments) {
    const balance = [];
    const quartes = {};
    return payments.reduce(function(acc, payment) {
        const part = value(payment, balance);
        acc[quarter(payment)] = round((acc[quarter(payment)] || 0) + part, 2);
        return acc;
    }, quartes);
}

module.exports = {
    totalIncome,
}
