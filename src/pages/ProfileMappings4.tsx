import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import { request } from '../Request';
import useAppsData from './ApplicationData';
import useMappingData from './MappingData';
import displayTextInsideTheNode from './NodeTextStyling';
import ProfileSources from './ProfileSources';
import { CSVLink } from 'react-csv';
import { Circles } from 'react-loading-icons';

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

  profileSourceLabel = label;
  appId = id2;

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
  const [disabled, setDisabled] = useState<boolean>(false);
  const [screenDisabled, setScreenDisabled] = useState<boolean>(false);
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
  const [appNamesForCsv, setAppNamesForCsv] = useState<any>([]);
  const [allAppsDataForCsvExport, setAllAppsDataForCsvExport] = useState<any>(
    []
  );
  const [finalDataForCsvExport, setFinalDataForCsvExport] = useState<any>([]);

  const [
    profileSources,
    loadedProfileSources,
    profileSourcesData,
  ] = ProfileSources(initialPosition - 150, profileSourceNumber);

  let initialElements = [
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

  useEffect(() => {
    getMappingDataForCsvExport();
  }, [downstreamMappingData, upstreamMappingData, appsData]);

  useEffect(() => {
    prepareDataForCsvExport();
  }, [upstreamMappingData, downstreamMappingData]);

  useEffect(() => {
    prepareDataForCsvExport();
  }, [allAppsDataForCsvExport]);

  useEffect(() => {
    declareHeaders1();
  }, [appNamesForCsv]);

  useEffect(() => {
    setScreenDisabled(true);
    setTimeout(() => {
      setScreenDisabled(false);
    }, 8000);
  }, []);

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
      // setDisabled(true);
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, 6000);
    }
  };

  const gotoUpstreamMapping = (appName) => {
    [...profileSourcesData].map((item) => {
      if (appName === item._embedded.app.label) {
        getUpstreamMappingsData(item._embedded.app.id);
      }
    });
  };

  //Mapping for all apps.
  const getMappingDataForCsvExport = () => {
    let dataArrayTemp: any = [];
    let dataArrayFinal: any = [];
    let appNamesArray: any = [];
    let upstreamData = { ...upstreamMappingData };
    setTimeout(() => {
      [...downstreamMappingData].map((item, index1) => {
        let appNameFound = true;
        let singleAppMappingData: any = Object.values(
          downstreamMappingData[index1]
        )[3];
        for (let index = 0; index < Object.keys(upstreamData).length; index++) {
          dataArrayTemp[index] = '';
        }
        if (Object.keys(singleAppMappingData).length === 0) {
          return;
        } else {
          Object.keys(upstreamData).map((column: any, index2) => {
            Object.keys(item.properties).map((key: any, index3) => {
              [...appsData].map((app) => {
                if (app._embedded.app.id === item.target.id) {
                  if (appNameFound) {
                    appNamesArray.push(app._embedded.app.label);
                    appNameFound = false;
                  }
                  if (
                    item.properties[key].expression.split('.')[1] === column
                  ) {
                    dataArrayTemp.splice(index2, 1, key);
                  }
                }
              });
            });
          });
          dataArrayFinal.push(dataArrayTemp.slice());
        }
      });
      setAppNamesForCsv(appNamesArray);
      setAllAppsDataForCsvExport(dataArrayFinal);
    }, 5000);
  };

  //Data for all apps.
  const prepareDataForCsvExport = () => {
    let mappingData = { ...upstreamMappingData };
    let key1Array: any = [];
    let value1Array: any = [];
    let index: any = 0;
    let finalOutput: any = [];
    Object.keys(mappingData).forEach((item: any, index) => {
      key1Array.push(mappingData[item].expression);
      value1Array.push(item);
    });
    while (index < key1Array.length) {
      let index1: any = 0;
      let output1 = {
        profileSource: key1Array[index],
        OKTA: value1Array[index],
      };
      while (index1 < allAppsDataForCsvExport.length) {
        const key: any = `data${index1 + 1}`;
        Object.assign(output1, {
          [key]: allAppsDataForCsvExport[index1][index],
        });
        index1++;
      }
      index++;
      let output: any = [];
      output.push(output1);
      finalOutput.push(output1);
    }
    setFinalDataForCsvExport(finalOutput);
    return finalOutput;
  };

  //Data for single selected app.
  const getSingleMappingDataForCsvExport = () => {
    // console.log('up', upstreamMapping);
    // console.log('down', downstreamMapping);
    // console.log('appName', appName);
    // console.log('sourceName', profileSourceName);
    let psToOktaArray: any = [];
    let oktaToAppArray: any = [];
    let psToOktaKeysArray: any = [];
    let psToOktaValuesArray: any = [];
    let oktaToAppKeysArray: any = [];
    let oktaToAppValuesArray: any = [];

    if (upstreamMapping !== undefined) {
      upstreamMapping.filter((up, index) => {
        if (
          up.id.split('-')[0] === 'appAttr' ||
          up.id.split('-')[0] === 'oktaAttr'
        ) {
          psToOktaArray.push(up.data.label.props.children[0]);
        }
      });
    }

    psToOktaArray.forEach((item, index) => {
      if (index % 2 === 0) {
        psToOktaKeysArray.push(item);
      } else if ((index + 1) % 2 === 0) {
        psToOktaValuesArray.push(item);
      }
    });

    // console.log(psToOktaKeysArray);

    setProfileSourceToOktaKeysArray(psToOktaKeysArray);
    setProfileSourceToOktaValuesArray(psToOktaValuesArray);

    if (downstreamMapping !== undefined) {
      downstreamMapping.filter((down, index) => {
        if (
          down.id.split('-')[0] === 'okta' ||
          down.id.split('-')[0] === 'oktaToMap'
        ) {
          oktaToAppArray.push(down.data.label.props.children[0]);
        }
      });
    }

    oktaToAppArray.forEach((item, index) => {
      if (index % 2 === 0) {
        oktaToAppKeysArray.push(item);
      } else if ((index + 1) % 2 === 0) {
        oktaToAppValuesArray.push(item);
      }
    });

    setOktaToAppKeysArray(oktaToAppKeysArray);
    setOktaToAppValuesArray(oktaToAppValuesArray);
  };

  const prepareSingleMappingDataForCsvExport = () => {
    let maxIndexLength: any = Math.max(
      profileSourceToOktaKeysArray.length,
      oktaToAppKeysArray.length
    );
    let output: any = [];

    if (
      // oktaToAppValuesArray.length !== 0 &&
      oktaToAppKeysArray.length !== 0 &&
      // profileSourceToOktaKeysArray.length !== 0 &&
      profileSourceToOktaValuesArray.length !== 0
    ) {
      for (let index = 0; index < maxIndexLength; index++) {
        oktaToAppKeysArray.map((item, position) => {
          if (item.split('.')[1] === profileSourceToOktaValuesArray[index]) {
            let output1 = [
              {
                profileSource: profileSourceToOktaKeysArray[index],
                okta: profileSourceToOktaValuesArray[index],
                appName: oktaToAppValuesArray[position],
              },
            ];
            output = output.concat(output1);
          }
        });
      }
    }
    // console.log(output);
    return output;
  };

  useEffect(() => {
    getSingleMappingDataForCsvExport();
  }, [upstreamMapping, downstreamMapping, profileSourceName]);

  // useEffect(() => {
  //   getMappingDataForCsvExport();
  // }, [appName]);

  useEffect(() => {
    prepareSingleMappingDataForCsvExport();
  }, [
    profileSourceToOktaKeysArray,
    profileSourceToOktaValuesArray,
    oktaToAppKeysArray,
    oktaToAppValuesArray,
  ]);

  //Headers for all apps.
  const declareHeaders1 = () => {
    let headers = [
      { label: `${profileSourceName}`, key: 'profileSource' },
      { label: 'OKTA', key: 'OKTA' },
    ];
    appNamesForCsv.forEach((item, index) => {
      headers.push({
        label: appNamesForCsv[index],
        key: `data${index + 1}`,
      });
    });
    return headers;
  };

  //Headers for single app.
  const declareHeaders2 = () => {
    let headers = [
      { label: `${profileSourceName}`, key: 'profileSource' },
      { label: 'Okta', key: 'okta' },
      { label: `${appName}`, key: 'appName' },
    ];
    return headers;
  };

  useEffect(() => {
    declareHeaders2();
  }, [profileSourceName, appName]);

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

  const buttonStyling: any = () => {
    const buttonStyle = {
      position: 'relative',
      left: '560px',
      backgroundColor: '#0A66C2',
      color: '#ffffff',
      border: 0,
      borderRadius: '100px',
      cursor: 'pointer',
      fontSize: '16px',
      justifyContent: 'center',
      lineHeight: '20px',
      maxWidth: '480px',
      minHeight: '40px',
      minWidth: '0px',
      overflow: 'hidden',
      padding: '0px',
      paddingLeft: '20px',
      paddingRight: '20px',
      textAlign: 'center',
      touchAction: 'manipulation',
      verticalAlign: 'middle',
    };
    return buttonStyle;
  };

  return (
    <div style={customNodeStyles}>
      <CSVLink
        data={finalDataForCsvExport}
        headers={declareHeaders1()}
        filename={`${profileSourceName}_mapping.csv`}
      >
        <div>
          <button disabled={disabled} style={buttonStyling()}>
            Download All Apps Mapping Data
          </button>
        </div>
      </CSVLink>
      <div
        style={{
          // width: '100px',
          // height: '100px',
          textAlign: 'center',
          position: 'absolute',
          justifyContent: 'center',
          margin: 'auto',
          right: '535px',
        }}
      >
        {disabled && (
          <Circles
            width={'30px'}
            height={'30px'}
            stroke="#98ff98"
            strokeOpacity={0.125}
            speed={2}
          />
        )}
      </div>

      <div
        style={{
          width: '800px',
          position: 'absolute',
          margin: '0',
          right: '535px',
        }}
      >
        {screenDisabled && (
          <Circles
            width={'30px'}
            height={'30px'}
            stroke="#98ff98"
            strokeOpacity={0.125}
            speed={2}
          />
        )}
      </div>

      <CSVLink
        data={prepareSingleMappingDataForCsvExport()}
        headers={declareHeaders2()}
        filename={`${profileSourceName} to ${appName} mapping.csv`}
      >
        <div>
          <button style={{ position: 'relative' }}>
            Download Selected App Mapping Data
          </button>
        </div>
      </CSVLink>

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

  // useEffect(() =>
  // // console.log(profileSourceLabel),
  // [appId]);

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
