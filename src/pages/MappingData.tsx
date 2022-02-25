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

  useEffect(() => {
    // tempName();
    console.log(loadedMappingData);
  }, [downstreamMapping]);

  useEffect(() => {
    getDefaultUserId();
    //     getUserId();
    try {
      getDownstreamMappingsData();
    } finally {
      console.log('loaded', loadedMappingData);
      setLoadedMappingData(true);
    }
  }, [loadedAppData]);

  //   console.log(loadedAppData);
  //   console.log(listOfApps);

  const getDefaultUserId = () => {
    sendUrl(`/api/v1/user/types`).then((response) => {
      const defaultId = response!.data[0].id;
      setUserProfileTemplateId(defaultId);
    });
  };

  const limiter = new RateLimiter({
    tokensPerInterval: 20,
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
          // setLoadedMappingData(false);
          console.log(loadedMappingData);
          return sendUrl(`/api/v1/mappings/${mappingId}`);
        });
        Promise.all(mappingDataOfTheApp).then((response: any) => {
          response.map((item) => {
            let mappingData: any = item.data;
            downstreamMappingData.push(mappingData);
            // setLoadedMappingData(false);
            console.log(loadedMappingData);
          });
        });
      })
      .then(() => {
        // tempName();
        setDownstreamMapping(downstreamMappingData);
        console.log('loaded', loadedMappingData);
      });
    // .then(() => {
    //   console.log(downstreamMappingData);
    //   console.log('done');
    //   setLoadedMappingData(true);
    // });
  };

  // const getDownstreamMappingsData = () => {
  //   let downstreamMappingData: any = [];
  //   const appsList: any = listOfApps.map(async (item: any, index: any) => {
  //     let appId = item._embedded.app.id;
  //     await limiter.removeTokens(1);
  //     return sendUrl(
  //       `/api/v1/mappings?sourceId=${userProfileTemplateId}&targetId=${appId}`
  //     );
  //   });
  //   Promise.all(appsList)
  //     .then((response: any) => {
  //       const mappingDataOfTheApp: any = response.map(
  //         async (id: any, index: any) => {
  //           const mappingId = Object.values(id.data[0])[0];
  //           await limiter.removeTokens(1);
  //           return sendUrl(`/api/v1/mappings/${mappingId}`);
  //         }
  //       );
  //       Promise.all(mappingDataOfTheApp).then((response: any) => {
  //         response.map((item) => {
  //           let mappingData: any = item.data;
  //           downstreamMappingData.push(mappingData);
  //           // setLoadedMappingData(false);
  //         });
  //       });
  //     })
  //     .then(() => {
  //       // tempName();
  //       setDownstreamMapping(downstreamMappingData);
  //       console.log('loaded', loadedMappingData);
  //     })
  //     .then(() => {
  //       console.log('done');
  //       setLoadedMappingData(true);
  //     });
  // };

  // const tempName = () => {
  //   setLoadedMappingData(true);
  // };

  return [loadedMappingData, downstreamMapping];
};

export default useMappingData;
