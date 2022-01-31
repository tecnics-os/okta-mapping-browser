import React, { useState, useEffect } from 'react';
import { request } from '../Request';

const sendUrl = (url: string) => {
  return request(url);
};

const useAppsData = () => {
  const [listOfApps, setListOfApps] = useState<any>([]);
  const [loadedAppData, setLoadedAppData] = React.useState<boolean>(false);

  const getAppsList = () => {
    sendUrl(`/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`).then(
      (response) => {
        const appData = response!.data;
        if (appData.length === 20) {
          loadMoreApps(appData);
        } else {
          setListOfApps(appData);
          setLoadedAppData(true);
        }
      }
    );
  };

  const loadMoreApps = (data: any) => {
    let allAppsLoaded = false;
    if (data.length % 20 === 0) {
      sendUrl(
        `/api/v1/apps/user/types?expand=app%2CappLogo&after=${
          data[data.length - 1]._embedded.app.id
        }&filter=apps&expand=app%2CappLogo`
      ).then((response) => {
        data = [...data, ...(response!.data ? response!.data : [])];
        loadMoreApps(data);
      });
    } else {
      allAppsLoaded = true;
    }
    if (allAppsLoaded) {
      setListOfApps(data);
      setLoadedAppData(true);
    }
  };

  useEffect(() => {
    getAppsList();
  }, []);

  return [loadedAppData, listOfApps];
};

export default useAppsData;
