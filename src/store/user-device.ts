import { Device, DeviceType } from '@/types/device';
import { create } from 'zustand';

type Action = {
  setDevice: (device: Device) => void;
  setWidth: (width: number) => void;
  reset: () => void;
};

const DEFAULT_DEVICE: Device = {
  type: 'unknown',
  os: 'unknown',
  browser: 'unknown',
  width: 0,
};

const getDeviceType = (width: number): DeviceType => {
  if (width < 768) {
    return 'mobile';
  }
  if (width < 1024) {
    return 'tablet';
  }
  return 'desktop';
};

export const useDeviceStore = create<Device & Action>((set) => ({
  ...DEFAULT_DEVICE,
  setDevice: (device: Device) =>
    set(() => ({
      ...device,
      type: getDeviceType(device.width),
    })),
  setWidth: (width: number) =>
    set((state) => {
      if (state.width === width) return state;

      return {
        ...state,
        width,
        type: getDeviceType(width),
      };
    }),
  reset: () => set(() => DEFAULT_DEVICE),
}));
