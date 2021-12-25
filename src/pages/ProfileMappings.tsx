import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFlow from 'react-flow-renderer';
import { useParams } from 'react-router-dom';
import logo from '../../assets/okta-logo.png';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '1500px',
};

const ProfileMappings = () => {
  let { id = '', label = '' } = { ...useParams() };

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

  const [appToOktaMappingId, setAppToOktaMappingId] = React.useState<any>('');
  const [oktaToAppMappingId, setOktaToAppMappingId] = React.useState<any>('');
  const [appToOktaMappingData, setAppToOktaMappingData] = React.useState<any>(
    {}
  );
  const [oktaToAppMappingData, setOktaToAppMappingData] = React.useState<any>(
    {}
  );
  //   const [initialElements, setInitialElements] = React.useState<any>([]);
  const [loadedData, setLoadedData] = React.useState<boolean>(false);
  //   const [loadedUrl, setLoadedUrl] = React.useState<boolean>(false);

  var appToOktaApiData = { ...appToOktaMappingData };
  var oktaToAppApiData = { ...oktaToAppMappingData };

  const baseUrl = 'https://dev-67150963.okta.com/api/v1/mappings';

  const getUrl = (url: string) => {
    return axios({
      method: 'get',
      url: `${url}`,
      headers: {
        Authorization: 'SSWS 006D9kXB5XS7Iv3rIvaQSiXkNCiEagJIpAeVjZ2Qj5',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  };

  const getApiData = () => {
    const sourceIdUrl = `${baseUrl}?sourceId=${id}`;
    const targetIdUrl = `${baseUrl}?targetId=${id}`;
    axios
      .all([getUrl(sourceIdUrl), getUrl(targetIdUrl)])
      .then(
        axios.spread((...responses) => {
          let responseOne = responses[0];
          let responseTwo = responses[1];
          let appToOktaMappingId = responseOne.data[0].id;
          let oktaToAppMappingId = responseTwo.data[0].id;
          console.log(appToOktaMappingId);

          setAppToOktaMappingId(appToOktaMappingId);
          setOktaToAppMappingId(oktaToAppMappingId);
          setLoadedData(true);
          getMappingData(appToOktaMappingId, oktaToAppMappingId);
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  const getMappingData = (id1: string, id2: string) => {
    const appToOktaMappingUrl = `${baseUrl}/${id1}`;
    const oktaToAppMappingUrl = `${baseUrl}/${id2}`;
    axios
      .all([getUrl(appToOktaMappingUrl), getUrl(oktaToAppMappingUrl)])
      .then(
        axios.spread((...response) => {
          let response1 = response[0];
          let response2 = response[1];
          let appToOktaMappingData = response1.data;
          let oktaToAppMappingData = response2.data;
          setAppToOktaMappingData(appToOktaMappingData);
          setOktaToAppMappingData(oktaToAppMappingData);
          //   setLoadedData(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  useEffect(() => {
    setAttributeMapping(initialElements);
    getApiData();
  }, [id]);

  const onElementClick = (event: any) => {
    if (event.target.id === 'upStream') {
      showApptoOktaMapping(appToOktaApiData);
    }
    if (event.target.id === 'downStream') {
      showOktaToAppMapping(oktaToAppApiData);
    }
  };

  const getLengthOfNodeText = (node: number, apiData: any) => {
    let previousNodeTextLength = 0;
    if (node == 0) {
      return previousNodeTextLength;
    } else {
      let previousNode = node - 1;
      previousNodeTextLength = Object.values<any>(apiData.properties)[
        previousNode
      ].expression.length;
      var currentNodeTextLength = previousNodeTextLength / 1.1;
      return currentNodeTextLength;
    }
  };

  const showApptoOktaMapping = (apiData: any) => {
    let tempNodes: any = [...initialElements];
    let yCoordinateOfElement = 0;
    Object.keys(apiData.properties).forEach((item, index) => {
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
                {apiData.properties[item].expression}
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
                {item}
                <img
                  style={{ position: 'absolute', right: '1px', top: '1px' }}
                  className="nodeWithLogo"
                  height="12"
                  width="12"
                  src={logo}
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
    Object.keys(apiData.properties).forEach((item, index) => {
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
                {apiData.properties[item].expression}
                <img
                  style={{ position: 'absolute', right: '1px', top: '1px' }}
                  className="nodeWithLogo"
                  height="12"
                  width="12"
                  src={logo}
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
          data: { label: item },
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
