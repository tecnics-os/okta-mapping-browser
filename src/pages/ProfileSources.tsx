import React, { useState, useEffect } from 'react';
import { request } from '../Request';
import displayTextInsideTheNode from './NodeTextStyling';
// import ReactFlow from 'react-flow-renderer';
// import { SettingsApplicationsRounded } from '@material-ui/icons';

const sendUrl = (url: string) => {
  return request(url);
};

const customNodeStyles: any = {
  overflow: 'hidden',
  width: '10000px',
  height: '650px',
};

const oktaColour = '#009CDD';
const defaultColour = 'white';

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

const ProfileSources = (initialPosition, profileSourceNumber) => {
  const [listOfProfileSources, setListOfProfileSources] = useState<any>([]);
  const [profileSources, setProfileSources] = useState<any>();
  const [loadedProfileSources, setLoadedProfileSources] = useState<Boolean>(
    false
  );

  const getProfileSources = () => {
    sendUrl(`/api/v1/apps/user/types?expand=app%2CappLogo&category=directory`)
      .then((response) => {
        let profileSourceData = response!.data;
        return getUniqueListBy(profileSourceData, 'id');
      })
      .then((uniqueList) => {
        setListOfProfileSources(uniqueList);
      })
      .then(() => {
        setLoadedProfileSources(true);
      });
  };

  const showProfileSources = () => {
    let tempNodes: any = [];
    let yCoordinateOfElement = -80;
    let uniqueProfileSources = [...listOfProfileSources];
    uniqueProfileSources.map((item: any, index: any) => {
      // console.log(item._embedded.app.id);
      tempNodes.push({
        id: `profileSource-${index + 1}`,
        sourcePosition: 'right',
        targetPosition: 'left',
        type: 'input',
        data: {
          label: displayTextInsideTheNode(
            item._embedded.app.label,
            item._embedded.appLogo.href
          ),
        },
        position: {
          x: 0,
          y: initialPosition += 80,
        },
        style: {
          background:
            `${index + 1}` === profileSourceNumber ? oktaColour : defaultColour,
        },
        // style: appNumber === index + 1 ? {background: '#D6D5E6'} : {background: 'white'}
      });
    });
    setProfileSources(tempNodes);
    // console.log(profileSources);
  };

  useEffect(() => {
    getProfileSources();
    showProfileSources();
  }, [loadedProfileSources]);

  useEffect(() => {
    showProfileSources();
  }, [initialPosition]);

  useEffect(() => {
    showProfileSources();
  }, [profileSourceNumber]);

  useEffect(() => {}, [loadedProfileSources]);

  return [profileSources, loadedProfileSources, listOfProfileSources];
};

export default ProfileSources;
