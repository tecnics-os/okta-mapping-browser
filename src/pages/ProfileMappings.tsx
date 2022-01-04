import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import oktaLogo from '../../assets/okta-logo.png';
import { request } from '../Request';
// import { WS_OKTA_API_TOKEN_KEY, WS_OKTA_BASE_URL_KEY } from '../constants';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '650px',
};

const ProfileMappings = () => {
  let { id1 = '', id2 = '', label = '', logo = '' } = { ...useParams() };
  const appLogo = decodeURIComponent(logo);

  const initialElements = [
    {
      id: 'appTitle',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'input',
      data: { label: 'Profile Mappings' },
      position: { x: 20, y: 200 },
    },
    {
      id: 'appToOkta',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: (
          <div id="upStream" className="downStream">
            {label} to Okta user
          </div>
        ),
      },
      position: { x: 270, y: 80 },
    },
    {
      id: 'oktaToApp',
      sourcePosition: 'right',
      targetPosition: 'left',
      type: 'default',
      data: {
        label: (
          <div id="downStream" className="downStream">
            Okta user to {label}
          </div>
        ),
      },
      position: { x: 270, y: 320 },
      overflow: 'hidden',
    },
    { id: 'arrow1', source: 'appTitle', target: `appToOkta`, animated: true },
    { id: 'arrow2', source: 'appTitle', target: `oktaToApp`, animated: true },
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

  const appToOktaApiData = { ...appToOktaMappingData };
  const oktaToAppApiData = { ...oktaToAppMappingData };
  const sendUrl = (url: string) => {
    return request(url);
  };

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
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  useEffect(() => {
    setAttributeMapping(initialElements);
    getApiData();
  }, [id2]);

  const onElementClick = (event: any) => {
    const errorMessage = 'There are no attributes for mapping.';
    if (event.target.id === 'upStream') {
      appToOktaApiData.propertyMappings.length === 0
        ? alert(errorMessage)
        : showApptoOktaMapping(appToOktaApiData);
    } else if (event.target.id === 'downStream') {
      oktaToAppApiData.propertyMappings.length === 0
        ? alert(errorMessage)
        : showOktaToAppMapping(oktaToAppApiData);
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
      var currentNodeTextLength = previousNodeTextLength / 1.1;
      return currentNodeTextLength;
    }
  };

  const showApptoOktaMapping = (apiData: any) => {
    let tempNodes: any = [...initialElements];
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
            x: 600,
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
            x: 900,
            y: yCoordinateOfElement += 50,
          },
          style: { borderColor: '#009CDD' },
        },
        {
          id: `user-${index + 1}`,
          source: 'appToOkta',
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
    let tempNodes: any = [...initialElements];
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
                {/* <div className="node"> */}
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
            x: 600,
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
            x: 900,
            y: yCoordinateOfElement += 50,
          },
        },
        {
          id: `user-${index + 1}`,
          source: 'oktaToApp',
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
        />
      )}
    </div>
  );
};

export default ProfileMappings;
