import { Box, Button, Paper, TextField } from '@material-ui/core';
import React from 'react';

export default function Settings() {
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
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="apikey"
          label="API Key"
          id="apikey"
        />
        <Box sx={{ display: 'flex' }}>
          <Button fullWidth variant="outlined" sx={{ mt: 3, mb: 2, mr: 2 }}>
            Test
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
