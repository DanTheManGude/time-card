"use client";

import { useEffect, useState } from "react";
import { constructNewPayPeriod } from "../utility";
import { LOCAL_STORAGE_KEY } from "../constants";

export function withPayPeriod(
  WrappedComponent: React.ComponentType<WithPayPeriodProps>
) {
  const ComponentWithTheme = () => {
    const [payPeriod, setPayPeriod] = useState<PayPeriod | null>(null);
    const [loaded, setLoaded] = useState<Boolean>(false);

    useEffect(() => {
      try {
        const maybeSavedPayPeriodRaw = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (maybeSavedPayPeriodRaw) {
          setPayPeriod(JSON.parse(maybeSavedPayPeriodRaw));
        }
      } catch (error) {
        console.error(error);
      }

      setLoaded(true);
    }, []);

    const updateDays = (updater: (existingDays: Day[]) => Day[]) => {
      setPayPeriod((existingPayPeriod) =>
        existingPayPeriod
          ? { ...existingPayPeriod, days: updater(existingPayPeriod.days) }
          : null
      );
    };

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

      updateDays((existingDays) => existingDays.splice(index, 1, newDay));
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
