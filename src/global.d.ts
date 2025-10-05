interface Window {
  ethereum?: {
    request: (args: {
      method: string;
      params?: Array<unknown>;
    }) => Promise<unknown>;
  };
}