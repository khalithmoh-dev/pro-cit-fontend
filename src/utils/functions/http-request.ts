const httpRequest = async (method: string, url: string, data: Record<string, any> = {}) => {
  const accessToken = window?.sessionStorage?.getItem('accessToken') as string;

  const jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    authorization: `Bearer ${accessToken ? JSON.parse(accessToken) : ''}`,
  };
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
  }
};

export default httpRequest;
