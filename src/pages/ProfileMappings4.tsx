import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import { request } from '../Request';
import useAppsData from './ApplicationData';
import useMappingData from './MappingData';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import initialElement from './InitialElements';
import displayTextInsideTheNode from './NodeTextStyling';
import ProfileSources from './ProfileSources';
import { CSVLink } from 'react-csv';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '2000px',
  height: '650px',
};

let profileSourceLabel;
let appId;
let defaultId;
let upstreamData;
let profileSourceLogo;
let nodeId;

const sendUrl = (url: string) => {
  return request(url);
};

const oktaColour = '#009CDD';
const defaultColour = 'white';

// const positionOfKey1 = '250';
// const positionOfValue1 = '500';
// const oktaNodePosition = '750';
// const positionOfKey2 = '1000';
// const positionOfValue2 = '1250';
// const positionOfApps = '1500';

const ProfileMappings = () => {
  let { defaultUserId = '', id2 = '', label = '', logo = '', nodeId = '' } = {
    ...useParams(),
  };

  // console.log(defaultUserId);

  profileSourceLabel = label;
  appId = id2;
  // console.log(id2);

  const appLogo = decodeURIComponent(logo);
  profileSourceLogo = appLogo;

  const [mapsLoaded, downstreamMappingData] = useMappingData();
  const [upstreamMappingData, setUpstreamMappingData] = React.useState<any>({});
  const [appMapping, setAppMapping] = useState<any>([]);
  const [clicked, setClicked] = useState(false);
  const [appsLoaded, appsData] = useAppsData();
  const [upstreamMapping, setUpstreamMapping] = useState<any>([]);
  const [downstreamMapping, setDownstreamMapping] = useState<any>([]);
  // const [appsForMapping, setAppsForMapping] = useState<any>([]);
  const [appNumber, setAppNumber] = useState<any>();
  const [profileSourceNumber, setProfileSourceNumber] = useState<any>(
    nodeId.split('-')[1]
  );
  const [profileSourceId, setProfileSourceId] = useState<any>('');
  let [initialPosition, setInitialPosition] = useState<any>(100);
  const [profileSourceLogoUrl, setProfileSourceLogoUrl] = useState<any>(
    profileSourceLogo
  );
  const [backgroundColourOfNode, setBackgroundColourOfNode] = useState<any>(
    'white'
  );
  const [appName, setAppName] = useState<any>();
  const [profileSourceName, setProfileSourceName] = useState<any>(label);
  const [
    profileSourceToOktaKeysArray,
    setProfileSourceToOktaKeysArray,
  ] = useState<any>([]);
  const [
    profileSourceToOktaValuesArray,
    setProfileSourceToOktaValuesArray,
  ] = useState<any>([]);
  const [oktaToAppKeysArray, setOktaToAppKeysArray] = useState<any>([]);
  const [oktaToAppValuesArray, setOktaToAppValuesArray] = useState<any>([]);

  // console.log(profileSourceName);

  const [
    profileSources,
    loadedProfileSources,
    profileSourcesData,
  ] = ProfileSources(initialPosition - 150, profileSourceNumber);

  // console.log(profileSources);
  let initialElements = [
    // {
    //   id: 'arrow1',
    //   source: `${profileSourceId}` === '' ? `${nodeId}` : `${profileSourceId}`,
    //   target: `oktaApp`,
    //   animated: true,
    //   label: 'mappings',
    // },
    {
      id: 'oktaApp',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: displayTextInsideTheNode('Okta', oktaLogo),
      },
      position: { x: 750, y: initialPosition },
    },
  ];

  const [attributeMapping, setAttributeMapping] = useState<any>(
    initialElements
  );

  const getUpstreamMappingsData = (appId) => {
    // console.log(defaultUserId);
    sendUrl(
      `/api/v1/mappings?sourceId=${appId}&targetId=${defaultUserId}`
    ).then((response) => {
      let mappingId = response!.data[0].id;
      sendUrl(`/api/v1/mappings/${mappingId}`).then((response) => {
        const mappingData = response!.data.properties;
        setUpstreamMappingData(mappingData);
      });
    });
  };

  const getMappingNodeTextLength = (node: number, data: any) => {
    let previousNodeTextLength = 0;
    if (node == 0) {
      return previousNodeTextLength;
    } else {
      let previousNode = node - 1;
      previousNodeTextLength = Object.values<any>(data)[previousNode].expression
        .length;
      let currentNodeTextLength = previousNodeTextLength / 1.1;
      // console.log(previousNodeTextLength);
      return currentNodeTextLength;
    }
  };

  upstreamData = upstreamMappingData;

  const showUpstreamMapping = () => {
    let tempNodes: any = [];
    let yCoordinateOfElement = initialPosition - 50;
    let mappingData = { ...upstreamMappingData };
    Object.keys(mappingData).forEach((item: any, index: any) => {
      tempNodes.push(
        {
          id: `appAttr-${index + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'default',
          data: {
            label: displayTextInsideTheNode(
              mappingData[item].expression,
              profileSourceLogoUrl
            ),
          },
          position: {
            x: 250,
            y: yCoordinateOfElement += getMappingNodeTextLength(
              index,
              upstreamMappingData
            ),
          },
        },
        {
          id: `oktaAttr-${index + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'default',
          data: {
            label: displayTextInsideTheNode(item, oktaLogo),
          },
          position: {
            x: 500,
            y: yCoordinateOfElement += 50,
          },
          style: { borderColor: '#009CDD' },
        },
        {
          id: `psToKey1-${index + 1}`,
          // source: 'appTitle',
          source:
            `${profileSourceId}` === '' ? `${nodeId}` : `${profileSourceId}`,
          target: `appAttr-${index + 1}`,
          animated: true,
        },
        {
          id: `key1-${index + 1}`,
          arrowHeadType: 'arrowclosed',
          source: `appAttr-${index + 1}`,
          target: `oktaAttr-${index + 1}`,
          animated: false,
        },
        {
          id: `value1-${index + 1}`,
          source: `oktaAttr-${index + 1}`,
          target: `oktaApp`,
          animated: true,
        }
      );
    });
    setUpstreamMapping(tempNodes);
    setAttributeMapping([...initialElements, ...tempNodes]);
  };

  const showAllAppsFromOkta = () => {
    let tempNodes: any = [];
    let yCoordinateOfElement = -50;
    [...appsData].forEach((item: any, index: any) => {
      // console.log(item._embedded.app.id);
      tempNodes.push({
        id: `app-${index + 1}`,
        sourcePosition: 'right',
        targetPosition: 'left',
        type: 'output',
        data: {
          label: displayTextInsideTheNode(
            item._embedded.app.label,
            item._embedded.appLogo.href
          ),
        },
        position: {
          x: 1500,
          y: yCoordinateOfElement += 70,
        },
        style: {
          background: `${index + 1}` === appNumber ? oktaColour : defaultColour,
        },
      });
    });
    setAppMapping(tempNodes);
  };

  const showDownstreamMapping = (
    appName: any,
    appNumber: number,
    yCoordinate: number
  ) => {
    let yCoordinateOfElement = yCoordinate - 200;
    let tempNodes: any = [];
    let mappingData = [...downstreamMappingData];
    mappingData.map((item, position) => {
      let singleAppMappingData = Object.values(mappingData[position])[3];
      [...appsData].map((app) => {
        if (
          item.target.id === app._embedded.app.id &&
          appName === app._embedded.app.label
        ) {
          if (Object.keys(item.properties).length === 0) {
            alert('There are no attributes for mapping.');
          } else {
            Object.keys(item.properties).map((key, index) => {
              tempNodes.push(
                {
                  id: `okta-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: displayTextInsideTheNode(
                      item.properties[key].expression,
                      oktaLogo
                    ),
                  },
                  position: {
                    x: 1000,
                    y: yCoordinateOfElement += getMappingNodeTextLength(
                      index,
                      singleAppMappingData
                    ),
                  },
                  style: { borderColor: '#009CDD' },
                },
                {
                  id: `oktaToMap-${index + 1}`,
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  type: 'default',
                  data: {
                    label: displayTextInsideTheNode(
                      key,
                      app._embedded.appLogo.href
                    ),
                  },
                  position: {
                    x: 1250,
                    y: yCoordinateOfElement += 50,
                  },
                },
                {
                  id: `oktaTo-${index + 1}`,
                  source: `oktaApp`,
                  target: `okta-${index + 1}`,
                  animated: true,
                },
                {
                  id: `oktaToApp-${index + 1}`,
                  source: `okta-${index + 1}`,
                  target: `oktaToMap-${index + 1}`,
                  animated: false,
                  arrowHeadType: 'arrowclosed',
                },
                {
                  id: `appToMap-${index + 1}`,
                  source: `oktaToMap-${index + 1}`,
                  target: `app-${appNumber}`,
                  animated: true,
                }
              );
            });
          }
        }
      });
    });
    setDownstreamMapping(tempNodes);
    setAttributeMapping([...initialElements, ...upstreamMapping, ...tempNodes]);
  };

  useEffect(() => {
    showUpstreamMapping();
  }, [upstreamMappingData, initialPosition]);

  useEffect(() => {
    setAttributeMapping([...initialElements]);
    getUpstreamMappingsData(id2);
    showUpstreamMapping();
  }, [id2]);

  // useEffect(() => {
  //   getInitialNodes(profileSourceId);
  // }, [profileSourceId]);

  useEffect(() => {
    setAttributeMapping([
      ...initialElements,
      ...upstreamMapping,
      ...downstreamMapping,
    ]);
  }, [appNumber]);

  useEffect(() => {
    showAllAppsFromOkta();
  }, [appsLoaded, clicked]);

  useEffect(() => {
    showAllAppsFromOkta();
  }, [appNumber]);

  // console.log(mapsLoaded);

  const onElementClick = (event: any, element: any) => {
    if (element.id === 'arrow1') {
      showUpstreamMapping();
    } else if (element.id.split('-')[0] === 'app') {
      let appName = event.srcElement.innerText;
      let yCoordinate = element.position.y;
      let appNumber = element.id.split('-')[1];
      setAppName(appName);
      showDownstreamMapping(appName, appNumber, yCoordinate);
      setInitialPosition(yCoordinate);
      setAppNumber(appNumber);
      setClicked(true);
      // getMappingDataForCsvExport();
    } else if (element.id.split('-')[0] === 'profileSource') {
      let id = element.id;
      let profileSourceNumber = element.id.split('-')[1];
      let logoUrl = element.data.label.props.children[1].props.src;
      gotoUpstreamMapping(event.srcElement.innerText);
      setProfileSourceId(id);
      setProfileSourceLogoUrl(logoUrl);
      setBackgroundColourOfNode(oktaColour);
      setProfileSourceNumber(profileSourceNumber);
      setProfileSourceName(event.srcElement.innerText);
    }
  };

  const gotoUpstreamMapping = (appName) => {
    [...profileSourcesData].map((item) => {
      if (appName === item._embedded.app.label) {
        // console.log(item._embedded.app.id);
        getUpstreamMappingsData(item._embedded.app.id);
      }
    });
  };

  const getMappingDataForCsvExport = () => {
    let upstreamData = { ...upstreamMappingData };
    console.log(downstreamMappingData);
    setTimeout(() => {
      Object.keys(upstreamData).map((second) => {
        // console.log(up);
        [...downstreamMappingData].map((item: any, index) => {
          let singleAppMappingData: any = Object.values(
            downstreamMappingData[index]
          )[3];
          console.log(singleAppMappingData);
          if (Object.keys(singleAppMappingData).length === 0) {
            return;
          } else {
            Object.keys(item.properties).map((third: any) => {
              if (item.properties[third].expression.split('.')[1] === second) {
                console.log(third);
              } else {
                console.log('Fine!');
              }
            });
          }
        });
      });
    }, 5000);
  };

  // const getMappingDataForCsvExport = () => {
  //   // console.log(upstreamMappingData);
  //   let dataArrayTemp: any = [];
  //   let dataArrayFinal: any = [];
  //   let upstreamData = { ...upstreamMappingData };
  //   console.log('appsData', appsData);
  //   // let mappingData = [...downstreamMappingData];
  //   // console.log(JSON.parse(JSON.stringify(downstreamMappingData)));
  //   setTimeout(() => {
  //     console.log('downData', downstreamMappingData);
  //     // console.log(mappingData);
  //     [...downstreamMappingData].map((item, index) => {
  //       let singleAppMappingData: any = Object.values(
  //         downstreamMappingData[index]
  //       )[3];
  //       if (Object.keys(singleAppMappingData).length === 0) {
  //         return;
  //       } else {
  //         Object.keys(item.properties).map((key: any, index) => {
  //           // console.log(item.properties[key].expression.split('.')[1]);
  //           Object.keys(upstreamData).map((column) => {
  //             [...appsData].map((app) => {
  //               if (app._embedded.app.id === item.target.id) {
  //                 // console.log(app._embedded.app.label, column, key);
  //                 if (
  //                   item.properties[key].expression.split('.')[1] === column
  //                 ) {
  //                   console.log(
  //                     // app._embedded.app.label,
  //                     // '--',
  //                     // column,
  //                     // '--',
  //                     key
  //                   );
  //                   // dataArrayTemp.push(key);
  //                 }
  //                 console.log('nothing');

  //                 // else if (
  //                 //   column !== item.properties[key].expression.split('.')[1]
  //                 // ) {
  //                 //   // dataArrayTemp.push('nothing');
  //                 // }
  //               }
  //               // console.log(app.id);
  //               // console.log(downstreamMappingData);
  //             });
  //             // if (column === item.properties[key].expression.split('.')[1]) {
  //             //   // console.log('Fine!');
  //             //   // console.log(
  //             //   //   column,
  //             //   //   item.properties[key].expression.split('.')[1]
  //             //   // );
  //             //   console.log(column, '--', key);
  //             // }
  //             // else if(item.properties[key].expression.split('.')[1]) {

  //             // }
  //           });
  //         });
  //       }
  //       dataArrayFinal.push(dataArrayTemp);
  //       console.log('***************************************');
  //       console.log(dataArrayFinal);
  //     });
  //     console.log(dataArrayFinal);
  //   }, 5000);
  //   // const mappingData = { ...upstreamMappingData };
  //   // Object.keys(mappingData).forEach((item: any) => {
  //   //   // console.log(mappingData[item].expression, item);
  //   //   console.log(appsData);
  //   // });
  // };

  // console.log(downstreamMappingData);
  useEffect(() => {
    // useMappingData();

    getMappingDataForCsvExport();
  }, [downstreamMappingData, upstreamMappingData]);

  // const getMappingDataForCsvExport = () => {
  //   // console.log('up', upstreamMapping);
  //   // console.log('down', downstreamMapping);
  //   // console.log('appName', appName);
  //   // console.log('sourceName', profileSourceName);
  //   let psToOktaArray: any = [];
  //   let oktaToAppArray: any = [];
  //   let psToOktaKeysArray: any = [];
  //   let psToOktaValuesArray: any = [];
  //   let oktaToAppKeysArray: any = [];
  //   let oktaToAppValuesArray: any = [];

  //   if (upstreamMapping !== undefined) {
  //     upstreamMapping.filter((up, index) => {
  //       if (
  //         up.id.split('-')[0] === 'appAttr' ||
  //         up.id.split('-')[0] === 'oktaAttr'
  //       ) {
  //         psToOktaArray.push(up.data.label.props.children[0]);
  //       }
  //     });
  //   }

  //   psToOktaArray.forEach((item, index) => {
  //     if (index % 2 === 0) {
  //       psToOktaKeysArray.push(item);
  //     } else if ((index + 1) % 2 === 0) {
  //       psToOktaValuesArray.push(item);
  //     }
  //   });

  //   // console.log(psToOktaKeysArray);

  //   setProfileSourceToOktaKeysArray(psToOktaKeysArray);
  //   setProfileSourceToOktaValuesArray(psToOktaValuesArray);

  //   if (downstreamMapping !== undefined) {
  //     downstreamMapping.filter((down, index) => {
  //       if (
  //         down.id.split('-')[0] === 'okta' ||
  //         down.id.split('-')[0] === 'oktaToMap'
  //       ) {
  //         oktaToAppArray.push(down.data.label.props.children[0]);
  //       }
  //     });
  //   }

  //   oktaToAppArray.forEach((item, index) => {
  //     if (index % 2 === 0) {
  //       oktaToAppKeysArray.push(item);
  //     } else if ((index + 1) % 2 === 0) {
  //       oktaToAppValuesArray.push(item);
  //     }
  //   });

  //   setOktaToAppKeysArray(oktaToAppKeysArray);
  //   setOktaToAppValuesArray(oktaToAppValuesArray);
  // };

  // const prepareDataForCsvExport = () => {
  //   let maxIndexLength: any = Math.max(
  //     profileSourceToOktaKeysArray.length,
  //     oktaToAppKeysArray.length
  //   );
  //   let output: any = [];

  //   if (
  //     // oktaToAppValuesArray.length !== 0 &&
  //     oktaToAppKeysArray.length !== 0 &&
  //     // profileSourceToOktaKeysArray.length !== 0 &&
  //     profileSourceToOktaValuesArray.length !== 0
  //   ) {
  //     for (let index = 0; index < maxIndexLength; index++) {
  //       oktaToAppKeysArray.map((item, position) => {
  //         if (item.split('.')[1] === profileSourceToOktaValuesArray[index]) {
  //           let output1 = [
  //             {
  //               profileSource: profileSourceToOktaKeysArray[index],
  //               okta: profileSourceToOktaValuesArray[index],
  //               appName: oktaToAppValuesArray[position],
  //             },
  //           ];
  //           output = output.concat(output1);
  //         }
  //       });
  //     }
  //   }
  //   // console.log(output);
  //   return output;
  // };

  const declareHeaders = () => {
    let headers = [
      { label: `${profileSourceName}`, key: 'profileSource' },
      { label: 'Okta', key: 'okta' },
      { label: `${appName}`, key: 'appName' },
    ];
    return headers;
  };

  // useEffect(() => {
  //   getMappingDataForCsvExport();
  // }, [upstreamMapping, downstreamMapping, profileSourceName]);

  // useEffect(() => {
  //   getMappingDataForCsvExport();
  // }, [appName]);

  // useEffect(() => {
  //   prepareDataForCsvExport();
  // }, [
  //   profileSourceToOktaKeysArray,
  //   profileSourceToOktaValuesArray,
  //   oktaToAppKeysArray,
  //   oktaToAppValuesArray,
  // ]);

  useEffect(() => {
    declareHeaders();
  }, [profileSourceName, appName]);

  return (
    <div style={customNodeStyles}>
      {/* <CSVLink
        data={prepareDataForCsvExport()}
        headers={declareHeaders()}
        filename={`${profileSourceName} to ${appName} mapping.csv`}
      >
        <div>
          <button
            style={{
              position: 'relative',
              left: '585px',
              backgroundColor: '#c32148',
              color: 'white',
            }}
          >
            Download Mapping Data
          </button>
        </div>
      </CSVLink> */}

      {mapsLoaded && loadedProfileSources && (
        <ReactFlow
          elements={[...attributeMapping, ...appMapping, ...profileSources]}
          onElementClick={onElementClick}
          defaultZoom={0.8}
        ></ReactFlow>
      )}
    </div>
  );
};

const useProfileSourceLabel = () => {
  // console.log(profileSourceLabel);
  // console.log(appId);

  useEffect(() => console.log(profileSourceLabel), [appId]);

  return [
    profileSourceLabel,
    defaultId,
    appId,
    upstreamData,
    profileSourceLogo,
    nodeId,
  ];
};

export { ProfileMappings, useProfileSourceLabel };
