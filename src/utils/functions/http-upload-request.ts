export const httpUploadRequest = async (method: string, url: string, data: any) => {
  const accessToken = window?.sessionStorage?.getItem('accessToken') as string;

  const myHeaders = new Headers();

  myHeaders.append('authorization', `Bearer ${accessToken ? JSON.parse(accessToken) : ''}`); // If needed, keep your custom headers

  // const formdata = new FormData();
  // formdata.append("files", data?.files[0], "1ef64445-3d7f-43b0-a87f-dee1cde30f55");

  const requestOptions: RequestInit = {
    method,
    headers: myHeaders, // Do not include Content-Type here
    body: data,
    redirect: 'follow',
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

export default httpUploadRequest;
