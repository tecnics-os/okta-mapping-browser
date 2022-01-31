import RingLoader from 'react-spinners/RingLoader';
import React, { useState } from 'react';
import useMappingData from '../pages/MappingData';
import { css } from '@emotion/react';

const override = css`
  display: flex;
  align-item: center;
  justify-content: center;
  // text-align: center;
  // margin: 100 auto;
`;

function LoadingSpinner() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#ffffff');
  const [mapsLoaded] = useMappingData();

  console.log(mapsLoaded);

  return (
    <div className="sweet-loading">
      {<RingLoader color={color} loading={loading} size={150} />}
    </div>
  );
}

export default LoadingSpinner;
