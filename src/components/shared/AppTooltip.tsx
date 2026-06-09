import { Tooltip } from "antd";
import type { TooltipProps } from "antd";

export const AppTooltip = ({
  title,
  children,
  styles,
  mouseEnterDelay = 0.3,
  mouseLeaveDelay = 0.3,
  destroyOnHidden = false,
  ...rest
}: TooltipProps) => (
  <Tooltip
    title={title}
    styles={{ container: { padding: "8px 12px" }, ...styles }}
    mouseEnterDelay={mouseEnterDelay}
    mouseLeaveDelay={mouseLeaveDelay}
    destroyOnHidden={destroyOnHidden}
    {...rest}
  >
    {children}
  </Tooltip>
);
