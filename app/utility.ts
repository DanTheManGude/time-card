const LOCAL_STORAGE_KEY = "TIME_CARD_PAY_PERIOD";

function isWeekday(date: Date) {
  const dayOfWeek = date.getDay();

  return dayOfWeek === 0 || dayOfWeek === 6;
}

function getFirstAndLastDays() {
  var firstDate;
  var lastDate;

  const today = new Date();

  if (today.getDate() <= 15) {
    firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
    lastDate = new Date(today.getFullYear(), today.getMonth(), 15);
  } else {
    const lastWeekdayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    while (!isWeekday(lastWeekdayOfMonth)) {
      lastWeekdayOfMonth.setDate(lastWeekdayOfMonth.getDate() - 1);
    }

    if (today.getDate() <= lastWeekdayOfMonth.getDate()) {
      firstDate = firstDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        16
      );
      lastDate = lastWeekdayOfMonth;
    } else {
      firstDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    }
  }

  return { firstDate, lastDate };
}

function constructNewPayPeriod(): PayPeriod {
  const { firstDate, lastDate } = getFirstAndLastDays();
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
