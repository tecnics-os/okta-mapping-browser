import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import { request } from '../Request';

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
      position: { x: 500, y: 200 },
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

  const [appToOktaMappingData, setAppToOktaMappingData] = React.useState<any>(
    {}
  );
  const [oktaToAppMappingData, setOktaToAppMappingData] = React.useState<any>(
    {}
  );
  const [loadedData, setLoadedData] = React.useState<boolean>(false);
  const [userProfileTemplateId, setUserProfileTemplateId] = useState<any>('');
  const [listOfApps, setListOfApps] = useState<any>([]);
  const appsData: any = [...listOfApps];

  const appToOktaApiData = { ...appToOktaMappingData };
  const oktaToAppApiData = { ...oktaToAppMappingData };

  const sendUrl = (url: string) => {
    return request(url);
  };

  const mappingNodes = [
    {
      id: 'pmToOkta',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: { label: <div>{label} to Okta</div> },
      position: { x: 500, y: 400 },
    },
    {
      id: 'oktaToPm',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: <div>Okta to {label}</div>,
      },
      position: { x: 500, y: 600 },
    },
    {
      id: 'pmToOktaEdge',
      source: 'appTitle',
      target: `pmToOkta`,
      animated: true,
    },
    {
      id: 'oktaToPmEdge',
      source: 'appTitle',
      target: `oktaToPm`,
      animated: true,
    },
  ];

  const getProfileTemplateAndAppIds = () => {
    let baseUrl = `/api/v1/user/types`;
    axios
      .all([
        sendUrl(baseUrl),
        sendUrl(`/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`),
      ])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const defaultId = responseOne!.data[0].id;
          const appData = responseTwo!.data;
          setUserProfileTemplateId(defaultId);
          setListOfApps(appData);
          setLoadedData(true);
          //   getAppNames(appData);
        })
      )
      //       .then(() => getAppNames())
      .catch((errors) => {
        console.error(errors);
      });
  };

  const getAppNames = (data: any) => {
    console.log(data);

    let yCoordinateOfElement = 0;
    let tempNodes: any = [...initialElements];
    data.forEach((item: any, position: number) => {
      console.log(item.displayName);
      tempNodes.push(
        {
          id: `app-${position + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'default',
          data: { label: <div>{item.displayName}</div> },
          position: {
            x: 950,
            y: yCoordinateOfElement += getLength(position, data),
          },
        },
        {
          id: `oktaToAppEdge-${position + 1}`,
          source: 'oktaApp',
          target: `app-${position + 1}`,
          animated: true,
          label: `mappings of ${item.displayName}`,
        }
      );
    });
    const finalElements = initialElements.concat(tempNodes);
    console.log(finalElements);
    setAttributeMapping(tempNodes);
  };

  useEffect(() => {
    console.log('Hello Srinivas');
    console.log(loadedData);

    getProfileTemplateAndAppIds();
  }, []);

  const getApiData = () => {
    // Authorization: 'SSWS 00Vvsg0QubATDRcwDWxpgRByqcpWJWFGcVjsDQnazX',
    // const baseUrl = 'https://dev-67150963.okta.com/api/internal/v1/mappings';
    const url = `/api/internal/v1/mappings`;
    const appToOktaUrl = `${url}?source=${id2}&target=${id1}`;
    const oktaToAppUrl = `${url}?source=${id1}&target=${id2}`;

    axios
      .all([sendUrl(appToOktaUrl), sendUrl(oktaToAppUrl)])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const appToOktaMappingData = responseOne!.data[0];
          const oktaToAppMappingData = responseTwo!.data[0];
          setAppToOktaMappingData(appToOktaMappingData);
          setOktaToAppMappingData(oktaToAppMappingData);
          setLoadedData(true);
          //   getAppNames();
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  useEffect(() => {
    setAttributeMapping(initialElements);
    //     getProfileTemplateAndAppIds();
    getApiData();
  }, [id2]);

  const onElementClick = (event: any, element: any) => {
    console.log(element.id);
    let tempNodes: any = [...initialElements];
    tempNodes.push(...mappingNodes);
    const errorMessage = 'There are no attributes for mapping.';
    if (element.id === 'arrow1') {
      setAttributeMapping(tempNodes);
    } else if (element.id === 'oktaApp') {
      getAppNames(appsData);
    } else if (element.id === 'pmToOkta') {
      appToOktaApiData.propertyMappings.length === 0
        ? alert(errorMessage)
        : showApptoOktaMapping(appToOktaApiData);
    } else if (element.id === 'oktaToPm') {
      oktaToAppApiData.propertyMappings.length === 0
        ? alert(errorMessage)
        : showOktaToAppMapping(oktaToAppApiData);
    } else if (element.id.includes('oktaToAppEdge')) {
      showMappingOfApps();
    }
  };

  const showMappingOfApps = () => {
    console.log(attributeMapping);
  };
  const getLength = (node: number, apiData: any) => {
    //     console.log(apiData[0].displayName.length);
    let previousNodeTextLength = 0;
    if (node == 0) {
      return previousNodeTextLength;
    } else {
      let previousNode = node - 1;
      previousNodeTextLength = apiData[previousNode].displayName.length;
      let currentNodeTextLength = previousNodeTextLength / 0.3;
      return currentNodeTextLength;
    }
  };

  const getLengthOfNodeText = (node: number, apiData: any) => {
    let previousNodeTextLength = 0;
    if (node == 0) {
      return previousNodeTextLength;
    } else {
      let previousNode = node - 1;
      previousNodeTextLength = Object.values<any>(apiData.propertyMappings)[
        previousNode
      ].sourceExpression.length;
      let currentNodeTextLength = previousNodeTextLength / 1.1;
      return currentNodeTextLength;
    }
  };

  const showApptoOktaMapping = (apiData: any) => {
    let tempNodes: any = [...initialElements, ...mappingNodes];
    let yCoordinateOfElement = 0;
    apiData.propertyMappings.forEach((item: any, index: any) => {
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
                {item.sourceExpression}
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
            x: 800,
            y: yCoordinateOfElement += getLengthOfNodeText(index, apiData),
          },
        },
        {
          id: `appAttr-${index + 1}`,
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'output',
          data: {
            label: (
              <div>
                {item.targetField}
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
            x: 1000,
            y: yCoordinateOfElement += 50,
          },
          style: { borderColor: '#009CDD' },
        },
        {
          id: `user-${index + 1}`,
          source: 'pmToOkta',
          target: `userAttr-${index + 1}`,
          animated: true,
        },
        {
          id: `app-${index + 1}`,
          arrowHeadType: 'arrowclosed',
          source: `userAttr-${index + 1}`,
          target: `appAttr-${index + 1}`,
          animated: false,
        }
      );
    });
    setAttributeMapping(tempNodes);
  };

  const showOktaToAppMapping = (apiData: any) => {
    let tempNodes: any = [...initialElements, ...mappingNodes];
    let yCoordinateOfElement = 0;
    apiData.propertyMappings.forEach((item: any, index: any) => {
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
                {item.sourceExpression}
                <img
                  style={{ position: 'absolute', right: '1px', top: '1px' }}
                  className="nodeWithLogo"
                  height="12px"
                  width="12px"
                  src={oktaLogo}
                />
              </div>
            ),
          },
          position: {
            x: 800,
            y: yCoordinateOfElement += getLengthOfNodeText(index, apiData),
          },
          style: { borderColor: '#009CDD' },
        },
        {
          id: `appAttr-${index + 1}`,
          targetPosition: 'left',
          type: 'output',
          data: {
            label: (
              <div>
                {item.targetField}
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
            x: 1000,
            y: yCoordinateOfElement += 50,
          },
        },
        {
          id: `user-${index + 1}`,
          source: 'oktaToPm',
          target: `userAttr-${index + 1}`,
          animated: true,
        },
        {
          id: `app-${index + 1}`,
          arrowHeadType: 'arrowclosed',
          source: `userAttr-${index + 1}`,
          target: `appAttr-${index + 1}`,
          animated: false,
        }
      );
    });
    setAttributeMapping(tempNodes);
  };

  return (
    <div style={customNodeStyles}>
      {loadedData && (
        <ReactFlow
          elements={attributeMapping}
          onElementClick={onElementClick}
        ></ReactFlow>
      )}
    </div>
  );
};

export default ProfileMappings;
