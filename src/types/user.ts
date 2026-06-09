export type Platform = "iOS" | "Android" | "Web" | "Desktop";

export interface PlatformConfig {
  icon: React.ElementType;
  background: string;
  iconColor: string;
  textColor: string;
}

export interface UserDevice {
  deviceId: string;
  platform: Platform;
  walletCount: number;
  installTime: string;
  lastActive: string;
}
