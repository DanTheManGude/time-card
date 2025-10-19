"use client";

import { useCallback, useEffect, useState } from "react";
import { constructNewPayPeriod, recalculatePayPeriod } from "../utility";
import { LOCAL_STORAGE_KEY } from "../constants";

export default function withPayPeriod(
  WrappedComponent: React.ComponentType<WithPayPeriodProps>
) {
  const Component = () => {
    const [payPeriod, setPayPeriod] = useState<PayPeriod>();
    const [nextPayPeriod, setNextPayPeriod] = useState<PayPeriod>();
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
        console.log("Saving pay period to local storage", payPeriod);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payPeriod));
      } else {
        setPayPeriod(constructNewPayPeriod(new Date()));
      }
    }, [payPeriod, loaded]);

    useEffect(() => {
      if (!payPeriod) {
        return;
      }
      const nextPayPeriodStart = new Date(payPeriod.lastDate);

      if (nextPayPeriod && nextPayPeriod.lastDate >= nextPayPeriodStart) {
        return;
      }

      nextPayPeriodStart.setDate(payPeriod.lastDate.getDate() + 1);

      setNextPayPeriod(constructNewPayPeriod(nextPayPeriodStart));
    }, [payPeriod, nextPayPeriod]);

    const updateDay = (getNewDay: (existingDay: Day) => Day, index: number) => {
      if (!payPeriod) {
        console.error("Updating day without pay period");
        return;
      }

      setPayPeriod((existingPayPeriod) =>
        existingPayPeriod
          ? recalculatePayPeriod({
              ...existingPayPeriod,
              days: existingPayPeriod.days.with(
                index,
                getNewDay(existingPayPeriod.days[index])
              ),
            })
          : undefined
      );
    };

    const resetPayPeriod = useCallback(() => {
      setPayPeriod(undefined);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log("Pay period reset");
    }, [setPayPeriod]);

    if (!payPeriod) {
      return null;
    }

    return (
      <WrappedComponent
        payPeriod={payPeriod}
        updateDay={updateDay}
        resetPayPeriod={resetPayPeriod}
        nextPayPeriod={nextPayPeriod}
      />
    );
  };

  Component.displayName = `withPayperiod(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Component;
}
