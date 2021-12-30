import { Box, Button, Paper, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { testApi } from '../api/oktapi';
import {
  WS_OKTA_API_TOKEN_KEY,
  WS_OKTA_BASE_URL_KEY,
  WS_OKTA_SETTINGS_VALID,
} from '../constants';

interface SettingsProps {}

export default function Settings(props: SettingsProps) {
  const [settingsValid, setSettingsValid] = useState(
    localStorage.getItem(WS_OKTA_SETTINGS_VALID) === 'true'
  );
  const [baseURL, setBaseURL] = useState(
    localStorage.getItem(WS_OKTA_BASE_URL_KEY) ?? ''
  );
  const [apiKey, setApiKey] = useState(
    localStorage.getItem(WS_OKTA_API_TOKEN_KEY) ?? ''
  );

  const handleTest = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const status = await testApi(baseURL, apiKey);
    setSettingsValid(status);
  };

  const handleSave = async () => {
    const status = await testApi(baseURL, apiKey);
    console.log(baseURL, apiKey);

    console.log('status', status);
    if (status) {
      localStorage.setItem(WS_OKTA_BASE_URL_KEY, baseURL);
      localStorage.setItem(WS_OKTA_API_TOKEN_KEY, apiKey);
      localStorage.setItem(WS_OKTA_SETTINGS_VALID, 'true');
    }
  };

  const handleRefresh = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <Paper>
      <Box component="form" sx={{ mt: 1, padding: 8 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="oktatenant"
          label="Okta Tenant base URL"
          name="oktatenent"
          defaultValue={baseURL}
          onChange={(event) => {
            setBaseURL(event.target.value);
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="apikey"
          label="API Key"
          id="apikey"
          defaultValue={apiKey}
          onChange={(event) => {
            setApiKey(event.target.value);
          }}
        />
        <Box sx={{ display: 'flex' }}>
          <Button
            fullWidth
            variant="outlined"
            // sx={{ mt: 3, mb: 2, mr: 2 }}
            onClick={handleTest}
          >
            {settingsValid ? 'Valid.' : 'Test'}
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            // sx={{ mt: 3, mb: 2 }}
            disabled={!settingsValid}
            onClick={() => {
              handleSave().then(() => window.location.reload());
              // console.log(apiKey, baseURL);
            }}
          >
            Save
          </Button>
          <Button
            fullWidth
            variant="outlined"
            type="submit"
            onClick={handleRefresh}
          >
            New Okta tenant
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
