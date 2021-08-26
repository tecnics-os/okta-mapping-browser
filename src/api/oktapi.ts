import { AxiosResponse } from 'axios';

const axios = require('axios');

const authHeader = {
  Authorization: `SSWS 00vv4ub8UIxq_ngC6-Xu11nTxJ53DxjD5cjFKKdD7o`,
};

const restClient = axios.create({
  baseURL: 'https://venuokta.oktapreview.com/api/v1/',
  timeout: 5000,
  headers: authHeader,
});

export async function getApplications(): Promise<unknown> {
  const response = await axios.get({ headers: authHeader });
  return response.data;
}

export async function testApi(
  oktaUrl: string,
  apiKey: string
): Promise<boolean> {
  const response = await axios({
    method: 'GET',
    baseURL: oktaUrl,
    url: '/apps',
    headers: { Authorization: `SSWS ${apiKey}` },
  }).then((apiResponse: AxiosResponse) => {
    if (apiResponse.status === 200) return true;
    return false;
  });
  return response;
}
