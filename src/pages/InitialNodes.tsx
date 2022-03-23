import { getAppCacheDir } from 'electron-updater/out/AppAdapter';
import React, { useState, useEffect } from 'react';
import ReactFlow from 'react-flow-renderer';
import { request } from '../Request';
// import initialElement from './InitialElements';
// import adLogo from '../../assets/ad-logo.png';
import ProfileSources from './ProfileSources';
import { useHistory } from 'react-router-dom';

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '650px',
};

const sendUrl = (url: string) => {
  return request(url);
};

const defalutBackgroundColour = 'white';

const InitialNodes = () => {
  const [userProfileTemplateId, setUserProfileTemplateId] = useState('');

  const [
    profileSources,
    loadedProfileSources,
    listOfProfileSources,
  ] = ProfileSources(0, defalutBackgroundColour);

  const getDefaultUserId = () => {
    sendUrl(`/api/v1/user/types`).then((response) => {
      const defaultId = response!.data[1].id;
      setUserProfileTemplateId(defaultId);
    });
  };

  let history = useHistory();

  const redirect = (
    id1: any,
    id2: any,
    label: any,
    logo: string,
    nodeId: string
  ) => {
    const logoUrl = encodeURIComponent(logo);
    history.push(`/mappings/${id1}/${id2}/${label}/${logoUrl}/${nodeId}`);
  };

  const onElementClick = (event: any, element: any) => {
    let appName = event.srcElement.innerText;
    getAppData(appName, element.id);
  };

  const getAppData = (appName, nodeId) => {
    [...listOfProfileSources].map((item) => {
      if (item._embedded.app.label === appName) {
        redirect(
          userProfileTemplateId,
          item._embedded.app.id,
          item._embedded.app.label,
          item._embedded.appLogo.href,
          nodeId
        );
      }
    });
  };

  useEffect(() => {
    getDefaultUserId();
  }, []);

  return (
    <div style={customNodeStyles}>
      {loadedProfileSources && (
        <ReactFlow
          elements={profileSources}
          onElementClick={onElementClick}
        ></ReactFlow>
      )}
    </div>
  );
};

export default InitialNodes;
