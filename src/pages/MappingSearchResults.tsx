import React from 'react';

const MappingList = (mappingList) => {
  const mappingsList = { ...mappingList };
  return (
    <>
      {Object.keys(mappingsList).forEach((data: any) => {
        if (data) {
          return <div>{data}</div>;
        }
        return null;
      })}
    </>
  );
};

export default MappingList;
