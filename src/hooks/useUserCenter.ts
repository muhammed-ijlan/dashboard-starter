import { useQuery } from "@tanstack/react-query";
import { userCenterApi, queryKeys } from "@/api";
import type { DeviceListParams } from "@/api";

interface UseUserCenterOptions {
  deviceParams?: DeviceListParams;
}

const EMPTY_DEVICE_PARAMS = {} as DeviceListParams;

export const useUserCenter = (options: UseUserCenterOptions = {}) => {
  const { deviceParams } = options;

  const summaryQuery = useQuery({
    queryKey: queryKeys.userCenter.summary(),
    queryFn: userCenterApi.getSummary,
  });

  const devicesQuery = useQuery({
    queryKey: queryKeys.userCenter.devices(deviceParams ?? EMPTY_DEVICE_PARAMS),
    queryFn: () => userCenterApi.getDevices(deviceParams ?? EMPTY_DEVICE_PARAMS),
    placeholderData: (prev) => prev,
    enabled: !!deviceParams,
  });

  return {
    summary: summaryQuery.data,
    devices: devicesQuery.data,

    summaryLoading: summaryQuery.isLoading,
    devicesLoading: devicesQuery.isLoading,
    devicesFetching: devicesQuery.isFetching,
  };
};
