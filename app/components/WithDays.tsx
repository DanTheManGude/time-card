export function withDays(WrappedComponent: React.ComponentType<WithDaysProps>) {
  const ComponentWithTheme = () => {
    return <WrappedComponent days={[]} />;
  };

  ComponentWithTheme.displayName = `withDays(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithTheme;
}
