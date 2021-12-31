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
    valid: localStorage.getItem(WS_OKTA_SETTINGS_VALID) === 'true',
  };
}

// test app should create a client form the scratch, to check the settings from user input.
export async function testApi(
  oktaUrl: string,
  apiKey: string
): Promise<boolean> {
  const response = await axios({
    method: 'GET',
    baseURL: oktaUrl,
    url: '/api/v1/user/types',
    headers: {
      Authorization: `SSWS ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
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
