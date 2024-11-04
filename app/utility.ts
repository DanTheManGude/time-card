const LOCAL_STORAGE_KEY = "TIME_CARD_PAY_PERIOD";

function constructNewPayPeriod(): PayPeriod {
  //TODO
  return { days: [], lastDate: new Date() };
}

export function savePayPeriod(payPeriod: PayPeriod) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payPeriod));
}

export function loadPayPeriod(): PayPeriod {
  const maybeSavedPayPeriodRaw = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!maybeSavedPayPeriodRaw) {
    return constructNewPayPeriod();
  }

  try {
    const payPeriod: PayPeriod = JSON.parse(maybeSavedPayPeriodRaw);

    const dateAfterLast = new Date(payPeriod.lastDate);
    dateAfterLast.setDate(dateAfterLast.getDate() + 1);

    if (dateAfterLast < new Date()) {
      return constructNewPayPeriod();
    }

    return payPeriod;
  } catch {
    return constructNewPayPeriod();
  }
}
