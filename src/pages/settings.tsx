import { Box, Button, Paper, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { testApi } from '../api/oktapi';
import {
  WS_OKTA_API_TOKEN_KEY,
  WS_OKTA_BASE_URL_KEY,
  WS_OKTA_SETTINGS_VALID,
} from '../constants';

export default function Settings() {
  const [settingsValid, setSettingsValid] = useState(
    localStorage.getItem(WS_OKTA_SETTINGS_VALID) === 'true' ? true : false
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

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const status = await testApi(baseURL, apiKey);
    if (status) {
      localStorage.setItem(WS_OKTA_BASE_URL_KEY, baseURL);
      localStorage.setItem(WS_OKTA_API_TOKEN_KEY, apiKey);
      localStorage.setItem(WS_OKTA_SETTINGS_VALID, 'true');
    }
  };

  return (
    <Paper>
      <Box component="form" noValidate sx={{ mt: 1, padding: 8 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="oktatenent"
          label="Okta Tenent"
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
            sx={{ mt: 3, mb: 2, mr: 2 }}
            onClick={handleTest}
          >
            {settingsValid ? 'Valid.' : 'Test'}
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!settingsValid}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
