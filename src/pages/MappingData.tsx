import React, { useState, useEffect } from 'react';
import { request } from '../Request';
import useAppsData from './ApplicationData';
import { RateLimiter } from 'limiter';

const sendUrl = (url: string) => {
  return request(url);
};

const useMappingData = () => {
  const [userProfileTemplateId, setUserProfileTemplateId] = useState<any>('');
  const [downstreamMapping, setDownstreamMapping] = React.useState<any>([]);
  const [loadedMappingData, setLoadedMappingData] = React.useState<boolean>(
    false
  );
  const [loadedAppData, listOfApps] = useAppsData();

  useEffect(() => {}, [downstreamMapping]);

  useEffect(() => {
    getDefaultUserId();
    try {
      getDownstreamMappingsData();
    } finally {
      setLoadedMappingData(true);
    }
  }, [loadedAppData]);

  const getDefaultUserId = () => {
    sendUrl(`/api/v1/user/types`).then((response) => {
      const defaultId = response!.data[0].id;
      setUserProfileTemplateId(defaultId);
    });
  };

  const limiter = new RateLimiter({
    tokensPerInterval: 25,
    interval: 'second',
  });

  const getDownstreamMappingsData = () => {
    let downstreamMappingData: any = [];
    const appsList: any = listOfApps.map(async (item: any, index: any) => {
      let appId = item._embedded.app.id;
      await limiter.removeTokens(1);
      return sendUrl(
        `/api/v1/mappings?sourceId=${userProfileTemplateId}&targetId=${appId}`
      );
    });
    Promise.all(appsList)
      .then((response: any) => {
        const mappingDataOfTheApp: any = response.map(async (id: any) => {
          const mappingId = Object.values(id.data[0])[0];
          await limiter.removeTokens(1);
          return sendUrl(`/api/v1/mappings/${mappingId}`);
        });
        Promise.all(mappingDataOfTheApp).then((response: any) => {
          response.map((item) => {
            let mappingData: any = item.data;
            downstreamMappingData.push(mappingData);
          });
        });
      })
      .then(() => {
        setDownstreamMapping(downstreamMappingData);
      });
    // .then(() => {
    //   console.log(downstreamMappingData);
    //   console.log('done');
    //   setLoadedMappingData(true);
    // });
  };

  return [loadedMappingData, downstreamMapping];
};

export default useMappingData;
