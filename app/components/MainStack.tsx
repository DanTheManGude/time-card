import { Stack } from "@mui/material";

export default function MainStack(props: React.PropsWithChildren) {
  return (
    <Stack direction={"column"} width={"100%"} paddingY={2} spacing={2}>
      {props.children}
    </Stack>
  );
}
