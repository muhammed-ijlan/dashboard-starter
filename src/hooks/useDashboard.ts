// Static placeholder data — replace with your own API calls.
export const useDashboard = () => {
  const trend = [
    { date: "Mon", transactions: 120 },
    { date: "Tue", transactions: 185 },
    { date: "Wed", transactions: 143 },
    { date: "Thu", transactions: 210 },
    { date: "Fri", transactions: 167 },
    { date: "Sat", transactions: 98 },
    { date: "Sun", transactions: 134 },
  ];

  const assetDistribution = [
    { chain: "A", chainLabel: "Asset A", percentage: 45 },
    { chain: "B", chainLabel: "Asset B", percentage: 30 },
    { chain: "C", chainLabel: "Asset C", percentage: 15 },
    { chain: "D", chainLabel: "Others", percentage: 10 },
  ];

  const recentActivity = [
    {
      txHash: "0x1a2b3c4d",
      type: "Transfer",
      rawType: "transfer",
      user: "user_001",
      amount: 500,
      tokenSymbol: "USD",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      txHash: "0x5e6f7a8b",
      type: "Deposit",
      rawType: "deposit",
      user: "user_002",
      amount: 1200,
      tokenSymbol: "USD",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      txHash: "0x9c0d1e2f",
      type: "Withdraw",
      rawType: "send",
      user: "user_003",
      amount: 250,
      tokenSymbol: "USD",
      status: "processing",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];

  const summary = {
    activeUsers: 1247,
    activeUsersChangePct: 8.2,
    totalInstalls: 5840,
    totalInstallsChangePct: 12.5,
    todayTransactions: 342,
    todayTransactionsChangePct: -3.1,
    totalVolume: 98500,
    totalVolumeChangePct: 5.7,
    volumeScope: "USD",
    dataDate: new Date().toISOString(),
  };

  const transactionVolume7d = trend.map((d) => ({
    date: d.date,
    volume: d.transactions * 280,
  }));

  return {
    summary,
    trend,
    assetDistribution,
    recentActivity,
    transactionVolume7d,
    isLoading: false,
    isError: false,
    refetchAll: () => {},
  };
};
