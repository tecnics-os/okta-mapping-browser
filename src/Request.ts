import { WS_OKTA_API_TOKEN_KEY, WS_OKTA_BASE_URL_KEY } from './constants';

const apiKey = localStorage.getItem(WS_OKTA_API_TOKEN_KEY);
const baseUrl = localStorage.getItem(WS_OKTA_BASE_URL_KEY);

export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new ResponseError(response);
  error.response = response;
  throw error;
}

const headers = {
  headers: {
    // Authorization: 'SSWS 00qgXvmjAIJpwx87gOeiUuHLS_zEBFeIX8omqyUTIN',
    Authorization: `SSWS ${apiKey}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export async function request(
  url: string,
  options?: any
): Promise<{} | { err: ResponseError }> {
  console.log({ ...options, ...headers });

  const fetchResponse = await fetch(`${baseUrl}${url}`, {
    ...options,
    ...headers,
  });
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}
