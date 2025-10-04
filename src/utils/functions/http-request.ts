const activeRequests: { count: number } = { count: 0 }; // tracks concurrent requests
let setLoadingGlobal: ((val: boolean) => void) | null = null;

export const initGlobalLoader = (setLoadingFn: (val: boolean) => void) => {
  setLoadingGlobal = setLoadingFn;
};

const httpRequest = async (
  method: string,
  url: string,
  data: Record<string, any> = {},
  addons?: { skipLoader?: boolean } // optional flag
) => {
  const { skipLoader = false } = addons || {};
  const accessToken = window?.sessionStorage?.getItem('accessToken') as string;

  const jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    authorization: `Bearer ${accessToken ? JSON.parse(accessToken) : ''}`,
  };

  if (!skipLoader) {
    activeRequests.count++;
    setLoadingGlobal?.(true);
  }

  try {
    const options: RequestInit = {
      method,
      headers: jsonHeaders,
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    if (!skipLoader) {
      activeRequests.count--;
      if (activeRequests.count === 0) setLoadingGlobal?.(false);
    }
  }
};

export default httpRequest;
