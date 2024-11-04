"use client";

import { useEffect, useState } from "react";
import { loadPayPeriod, savePayPeriod } from "../utility";

export function withPayPeriod(
  WrappedComponent: React.ComponentType<WithPayPeriodProps>
) {
  const payPeriod = loadPayPeriod();

  const ComponentWithTheme = () => {
    const [days, setDays] = useState<Day[]>(payPeriod.days);

    useEffect(() => {
      savePayPeriod({ ...payPeriod, days });
    }, [days]);

    const updateDay = (newDay: Day) => {
      const index = days.findIndex(
        (day) => day.date.getTime() === newDay.date.getTime()
      );

      setDays((oldDays) => {
        const updatedDays = oldDays.splice(index, 1, newDay);
        return updatedDays;
      });
    };

    return <WrappedComponent days={days} updateDay={updateDay} />;
  };

  ComponentWithTheme.displayName = `withDays(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithTheme;
}
