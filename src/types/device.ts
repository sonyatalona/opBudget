export type OS = 'unknown' | 'android' | 'ios' | 'windows' | 'linux' | 'other';
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';
export type Device = {
  os: OS;
  type: DeviceType;
  browser: string;
  width: number;
};
