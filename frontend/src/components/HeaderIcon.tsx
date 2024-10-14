import React from "react";

type AppIconProps = React.ComponentPropsWithoutRef<"div"> & {
  size?: number;
};
export function AppIcon({ size, ...props }: AppIconProps) {
  const styles = {
    backgroundColor: "white",
    borderRadius: "100%",
    aspectRatio: 1 / 1,
    display: "flex",
    justifyItems: "center",
    alignItems: "center",
    height: `${size ?? 24}px`,
    width: `${size ?? 24}px`,
  } as React.CSSProperties;
  return (
    <div {...props}>
      <div style={styles}>
        {/* dont forget add `/` like `/logo.png` to avoid missing asset */}
        <img src="/logo.png" />
      </div>
    </div>
  );
}
