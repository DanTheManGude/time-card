"use client";

import { useCallback, useEffect, useState } from "react";
import {
  constructNewPayPeriod,
  getParsedSavedPayPeriod,
  recalculatePayPeriod,
  removeSavedPayPeriod,
  savePayPeriodToLocalStorage,
} from "../utility";

export default function withPayPeriod(
  WrappedComponent: React.ComponentType<WithPayPeriodProps>
) {
  const Component = () => {
    const [payPeriod, setPayPeriod] = useState<PayPeriod>();
    const [nextPayPeriod, setNextPayPeriod] = useState<PayPeriod>();
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
      let savedFullPayPeriod: PayPeriod | undefined;
      try {
        savedFullPayPeriod = getParsedSavedPayPeriod();
      } catch (error) {
        console.error(error);
      }

      if (savedFullPayPeriod) {
        setPayPeriod(savedFullPayPeriod);
      } else {
        removeSavedPayPeriod();
      }

      setLoaded(true);
    }, []);

    useEffect(() => {
      if (!loaded) {
        return;
      }
      if (payPeriod) {
        savePayPeriodToLocalStorage(payPeriod);
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
      removeSavedPayPeriod();
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
