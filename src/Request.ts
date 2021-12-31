import axios, { AxiosResponse } from 'axios';
import { WS_OKTA_API_TOKEN_KEY, WS_OKTA_BASE_URL_KEY } from './constants';

const apiKey = localStorage.getItem(WS_OKTA_API_TOKEN_KEY);
const baseUrl = localStorage.getItem(WS_OKTA_BASE_URL_KEY);

export class ResponseError extends Error {
  public response: AxiosResponse;

  constructor(response: AxiosResponse) {
    super(response.statusText);
    this.response = response;
  }
}

function parseJSON(response: AxiosResponse) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response;
}

function checkStatus(response: AxiosResponse) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new ResponseError(response);
  error.response = response;
  throw error;
}

const headers = {
  headers: {
    Authorization: `SSWS ${apiKey}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export async function request(url: string, options?: any) {
  const getResponse: AxiosResponse<any> = await axios({
    method: 'GET',
    url: `${baseUrl}${url}`,
    ...headers,
  });
  const response: AxiosResponse<any> = checkStatus(getResponse);
  return parseJSON(response);
}
