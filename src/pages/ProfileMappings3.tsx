import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import { request } from '../Request';
import { anyTypeAnnotation } from '@babel/types';
import { RateLimiter } from 'limiter';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '650px',
};

const ProfileMappings = () => {
  let { id1 = '', id2 = '', label = '', logo = '' } = {
    ...useParams(),
  };
  const appLogo = decodeURIComponent(logo);
  const [arrowClick, setArrowClick] = React.useState<boolean>(false);

  let initialElements = [
    {
      id: 'appTitle',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: { label: <div>{label}</div> },
      position: { x: 200, y: 200 },
    },
    {
      id: 'oktaApp',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: <div>Okta</div>,
      },
      position: { x: 900, y: 200 },
    },
    {
      id: 'arrow1',
      source: 'appTitle',
      target: `oktaApp`,
      animated: true,
      label: 'mappings',
    },
  ];
  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );
  const [appMapping, setAppMapping] = useState<any>([]);

  const [upstreamMapping, setUpstreamMapping] = React.useState<any>({});
  const [downstreamMapping, setDownstreamMapping] = React.useState<any>([]);
  const [loadedData, setLoadedData] = React.useState<boolean>(false);
  const [loadedMappingData, setLoadedMappingData] = React.useState<boolean>(
    false
  );
  const [userProfileTemplateId, setUserProfileTemplateId] = useState<any>('');
  const [listOfApps, setListOfApps] = useState<any>([]);

  const appsData: any = [...listOfApps];
  // const appToOktaApiData = { ...appToOktaMappingData };
  // const oktaToAppApiData = { ...oktaToAppMappingData };

  const sendUrl = (url: string) => {
    return request(url);
  };

  // const getApiData = () => {
  //   // Authorization: 'SSWS 00Vvsg0QubATDRcwDWxpgRByqcpWJWFGcVjsDQnazX',
  //   // const baseUrl = 'https://dev-67150963.okta.com/api/internal/v1/mappings';
  //   const url = `/api/internal/v1/mappings`;
  //   const appToOktaUrl = `${url}?source=${id2}&target=${id1}`;
  //   const oktaToAppUrl = `${url}?source=${id1}&target=${id2}`;

  //   axios
  //     .all([sendUrl(appToOktaUrl), sendUrl(oktaToAppUrl)])
  //     .then(
  //       axios.spread((...responses) => {
  //         const responseOne = responses[0];
  //         const responseTwo = responses[1];
  //         const appToOktaMappingData = responseOne!.data[0];
  //         const oktaToAppMappingData = responseTwo!.data[0];
  //         setAppToOktaMappingData(appToOktaMappingData);
  //         setOktaToAppMappingData(oktaToAppMappingData);
  //         setLoadedData(true);
  //         //   getAppNames();
  //       })
  //     )
  //     .catch((errors) => {
  //       console.error(errors);
  //     });
  // };

  const getDefaultUserId = () => {
    sendUrl(`/api/v1/user/types`).then((response) => {
      const defaultId = response!.data[0].id;
      setUserProfileTemplateId(defaultId);
      setLoadedData(true);
    });
  };

  const getAppsList = () => {
    sendUrl(`/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`).then(
      (response) => {
        const appData = response!.data;
        if (appData.length === 20) {
          loadMoreApps(appData);
        } else {
          setListOfApps(appData);
        }
      }
    );
  };

  const loadMoreApps = (data: any) => {
    let flag = false;
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
      flag = true;
    }
    if (flag) {
      setListOfApps(data);
    }
  };

  const mapAllAppsFromOkta = () => {
    let tempNodes: any = [...attributeMapping];
    // let mappingData = { ...downstreamMapping };
    let yCoordinateOfElement = 0;
    appsData.forEach((item: any, index: any) => {
      tempNodes.push(
        {
          id: `app-${index + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'default',
          data: {
            label: (
              <div
                style={{
                  flexWrap: 'wrap',
                  overflowWrap: 'break-word',
                }}
              >
                {item._embedded.app.label}
                <img
                  style={{
                    position: 'absolute',
                    right: '1px',
                    top: '1px',
                  }}
                  className="appLogo"
                  height="10px"
                  width="auto"
                  src={item._embedded.appLogo.href}
                />
              </div>
            ),
          },
          position: {
            x: 1200,
            y: yCoordinateOfElement += 50,
          },
        },
        {
          id: `appArrow${index + 1}`,
          source: `oktaApp`,
          target: `app-${index + 1}`,
          animated: true,
        }
      );
    });
    setAttributeMapping(tempNodes);
    setAppMapping(tempNodes);
    // setAppMapping(tempNodes);
  };

  const getUpstreamMappingsData = () => {
    sendUrl(`/api/v1/mappings?sourceId=${id2}&targetId=${id1}`).then(
      (response) => {
        let mappingId = response!.data[0].id;
        sendUrl(`/api/v1/mappings/${mappingId}`).then((response) => {
          const mappingData = response!.data.properties;
          setUpstreamMapping(mappingData);
        });
      }
    );
  };

  const limiter = new RateLimiter({ tokensPerInterval: 7, interval: 'second' });

  // async function requestHandler() {
  //   await limiter.removeTokens(1);
  //   // getDownstreamMappingsData();
  // }
  const timerForApiLimiting = (ms) => new Promise((res) => setTimeout(res, ms));

  const getDownstreamMappingsData = () => {
    let downstreamMappingData: any = [];
    let pauseTimeInMilliSeconds: number = 500;
    const appsList: any = appsData.map(async (item: any, index: any) => {
      let appId = item._embedded.app.id;
      if (index % 5 === 0) {
        await timerForApiLimiting(pauseTimeInMilliSeconds);
      }
      return sendUrl(`/api/v1/mappings?sourceId=${id1}&targetId=${appId}`);
    });
    console.log(appsList);
    Promise.all(appsList).then((response: any) => {
      const mappingDataOfTheApp: any = response.map(
        async (id: any, index: any) => {
          const mappingId = Object.values(id.data[0])[0];
          // console.log(mappingId);
          if (index % 5 === 0) {
            await timerForApiLimiting(pauseTimeInMilliSeconds);
          }
          return sendUrl(`/api/v1/mappings/${mappingId}`);
        }
      );
      Promise.all(mappingDataOfTheApp)
        .then((response: any) => {
          response.map((item) => {
            let mappingData: any = item.data;
            downstreamMappingData.push(mappingData);
            // console.log(item.data.properties);
          });
        })
        .then(() => {
          setDownstreamMapping(downstreamMappingData);
        })
        .then(() => setLoadedMappingData(true));
    });
  };

  // const getLengthOfNodeText = (node: number, textLength: number) => {
  //   let previousNodeTextLength = 0;
  //   if (node === 0) {
  //     return previousNodeTextLength;
  //   } else {
  //   }
  // };

  const showUpstreamMapping = () => {
    let tempNodes: any = [...attributeMapping];
    let yCoordinateOfElement = 0;
    let mappingData = { ...upstreamMapping };
    Object.keys(mappingData).forEach((item: any, index: any) => {
      tempNodes.push(
        {
          id: `userAttr-${index + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'default',
          data: {
            label: (
              <div
                style={{
                  flexWrap: 'wrap',
                  overflowWrap: 'break-word',
                }}
              >
                {mappingData[item].expression}
                <img
                  style={{
                    position: 'absolute',
                    right: '1px',
                    top: '1px',
                  }}
                  className="appLogo"
                  height="10px"
                  width="auto"
                  src={appLogo}
                />
              </div>
            ),
          },
          position: {
            x: 420,
            y: yCoordinateOfElement += 50,
          },
        },
        {
          id: `appAttr-${index + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'default',
          data: {
            label: (
              <div>
                {item}
                <img
                  style={{ position: 'absolute', right: '1px', top: '1px' }}
                  className="oktaLogo"
                  height="12"
                  width="12"
                  src={oktaLogo}
                />
              </div>
            ),
          },
          position: {
            x: 650,
            y: yCoordinateOfElement += 50,
          },
          style: { borderColor: '#009CDD' },
        },
        {
          id: `pmToApp-${index + 1}`,
          source: 'appTitle',
          target: `userAttr-${index + 1}`,
          animated: true,
        },
        {
          id: `app-${index + 1}`,
          arrowHeadType: 'arrowclosed',
          source: `userAttr-${index + 1}`,
          target: `appAttr-${index + 1}`,
          animated: false,
        },
        {
          id: `appToOkta-${index + 1}`,
          source: `appAttr-${index + 1}`,
          target: `oktaApp`,
          animated: true,
        }
      );
    });
    setAttributeMapping(tempNodes);
  };

  const showDownstreamMapping = (
    appName: any,
    appNumber: number,
    yCoordinate: number
  ) => {
    setAttributeMapping(attributeMapping);
    let yCoordinateOfElement = yCoordinate - 200;
    // let tempNodes: any = [...attributeMapping];
    let tempNodes: any = [];
    let mappingData = [...downstreamMapping];
    let finalElements = [...attributeMapping];
    // console.log(appsData);
    // console.log(mappingData);
    mappingData.map((item) => {
      appsData.map((app) => {
        if (
          item.target.id === app._embedded.app.id &&
          appName === app._embedded.app.label
        ) {
          // console.log(item);
          console.log(Object.keys(item.properties).length);
          if (Object.keys(item.properties).length === 0) {
            alert('There are no attributes for mapping.');
          } else {
            Object.keys(item.properties).map((key, index) => {
              // console.log(key);
              // console.log(item.properties[key].expression);
              // console.log(index);
              tempNodes.push(
                {
                  id: `okta-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: (
                      <div
                        style={{
                          flexWrap: 'wrap',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {item.properties[key].expression}
                        <img
                          style={{
                            position: 'absolute',
                            right: '1px',
                            top: '1px',
                          }}
                          className="appLogo"
                          height="10px"
                          width="auto"
                          src={oktaLogo}
                        />
                      </div>
                    ),
                  },
                  position: {
                    x: 1450,
                    y: yCoordinateOfElement += 30,
                  },
                  style: { borderColor: '#009CDD' },
                },
                {
                  id: `oktaToMap-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: (
                      <div>
                        {key}
                        <img
                          style={{
                            position: 'absolute',
                            right: '1px',
                            top: '1px',
                          }}
                          className="oktaLogo"
                          height="12px"
                          width="auto"
                          src={app._embedded.appLogo.href}
                        />
                      </div>
                    ),
                  },
                  position: {
                    x: 1700,
                    y: yCoordinateOfElement += 50,
                  },
                },
                {
                  id: `oktaTo-${index + 1}`,
                  source: `app-${appNumber}`,
                  target: `okta-${index + 1}`,
                  animated: true,
                },
                {
                  id: `oktaToApp-${index + 1}`,
                  arrowHeadType: 'arrowclosed',
                  source: `okta-${index + 1}`,
                  target: `oktaToMap-${index + 1}`,
                  animated: false,
                }
              );
            });
          }
        }
      });
    });
    setAttributeMapping([...appMapping, ...tempNodes]);
  };

  useEffect(() => {
    setAttributeMapping(initialElements);
    getDefaultUserId();
    getAppsList();
    getUpstreamMappingsData();
    getDownstreamMappingsData();
    // requestHandler();
  }, [id2]);

  const onElementClick = (event: any, element: any) => {
    if (element.id === 'arrow1') {
      showUpstreamMapping();
    } else if (element.id === 'oktaApp') {
      console.log('Hello!');
      mapAllAppsFromOkta();
    } else if (element.id.split('-')[0] === 'app') {
      let appName = event.srcElement.innerText;
      let yCoordinate = element.position.y;
      let appNumber = element.id.split('-')[1];
      showDownstreamMapping(appName, appNumber, yCoordinate);
    }
  };

  return (
    <div style={customNodeStyles}>
      {loadedData && loadedMappingData && (
        <ReactFlow
          elements={attributeMapping}
          onElementClick={onElementClick}
        ></ReactFlow>
      )}
    </div>
  );
};

export default ProfileMappings;
