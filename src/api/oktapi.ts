import { AxiosError, AxiosResponse } from 'axios';

import {
  WS_OKTA_API_TOKEN_KEY,
  WS_OKTA_BASE_URL_KEY,
  WS_OKTA_SETTINGS_VALID,
} from '../constants';

const axios = require('axios');

export interface OktaSettings {
  key: string;
  url: string;
  valid: boolean;
}

export function ReadOktaSettings(): OktaSettings {
  return {
    key: localStorage.getItem(WS_OKTA_API_TOKEN_KEY) ?? '',
    url: localStorage.getItem(WS_OKTA_BASE_URL_KEY) ?? '',
    valid: localStorage.getItem(WS_OKTA_BASE_URL_KEY) === 'true',
  };
}
const authHeader = {
  Authorization: `SSWS ${ReadOktaSettings().key}`,
};

const restClient = () => {
  return axios.create({
    baseURL: ReadOktaSettings().url,
    timeout: 5000,
    headers: authHeader,
  });
};

// test app should create a client form the scratch, to check the settings from user input.
export async function testApi(
  oktaUrl: string,
  apiKey: string
): Promise<boolean> {
  const response = await axios({
    method: 'GET',
    baseURL: oktaUrl,
    url: '/apps',
    headers: { Authorization: `SSWS ${apiKey}` },
  })
    .then((apiResponse: AxiosResponse) => {
      if (apiResponse.status === 200) return true;
      return false;
    })
    .catch((error: AxiosError) => {
      return false;
    });
  return response;
}

export async function getApplications(): Promise<unknown> {
  const response = await restClient().get('/apps');
  return response.data;
}

// TODO Get application mapping downstream okta->app

// TODO Get application mapping upstream app->okta
