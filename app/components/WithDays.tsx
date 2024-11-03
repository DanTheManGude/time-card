"use client";

import { useEffect, useState } from "react";

type PayPeriod = {};

function saveDays(days: Day[]) {}

function loadDays(): Day[] {
  return [];
}

export function withDays(WrappedComponent: React.ComponentType<WithDaysProps>) {
  const ComponentWithTheme = () => {
    const [days, setDays] = useState<Day[]>(loadDays());

    useEffect(() => {
      saveDays(days);
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
