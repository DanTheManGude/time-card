"use client";

import { useEffect, useState } from "react";
import { constructNewPayPeriod, recalculatePayPeriod } from "../utility";
import { LOCAL_STORAGE_KEY } from "../constants";

export function withPayPeriod(
  WrappedComponent: React.ComponentType<WithPayPeriodProps>
) {
  const ComponentWithTheme = () => {
    const [payPeriod, setPayPeriod] = useState<PayPeriod | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
      try {
        const maybeSavedPayPeriodRaw = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (maybeSavedPayPeriodRaw) {
          const parsedSavedPayPeriod: ParsedSavedPayPeriod = JSON.parse(
            maybeSavedPayPeriodRaw
          );

          const convertedLastDate = new Date(parsedSavedPayPeriod.lastDate);
          const dayAfterLast = new Date(convertedLastDate);
          dayAfterLast.setDate(convertedLastDate.getDate() + 1);

          if (dayAfterLast > new Date()) {
            setPayPeriod({
              ...parsedSavedPayPeriod,
              days: parsedSavedPayPeriod.days.map((savedDay) => ({
                ...savedDay,
                date: new Date(savedDay.date),
              })),
              lastDate: convertedLastDate,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoaded(true);
    }, []);

    useEffect(() => {
      if (!loaded) {
        return;
      }
      if (payPeriod) {
        console.log("saving pay period", payPeriod);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payPeriod));
      } else {
        setPayPeriod(constructNewPayPeriod());
      }
    }, [payPeriod, loaded]);

    const updateDay = (newDay: Day) => {
      if (!payPeriod) {
        console.error("Updating day without pay period");
        return;
      }

      const index = payPeriod.days.findIndex(
        (day) => day.date.getTime() === newDay.date.getTime()
      );

      setPayPeriod((existingPayPeriod) =>
        existingPayPeriod
          ? recalculatePayPeriod({
              ...existingPayPeriod,
              days: existingPayPeriod.days.splice(index, 1, newDay),
            })
          : null
      );
    };

    if (!payPeriod) {
      return null;
    }

    return <WrappedComponent payPeriod={payPeriod} updateDay={updateDay} />;
  };

  ComponentWithTheme.displayName = `withDays(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithTheme;
}
