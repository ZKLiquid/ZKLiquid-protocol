import React from 'react';

/**
 * @template T
 * @param {T} data
 */
function useDataRef(data) {
  const ref = React.useRef(data);
  ref.current = data;
  return ref;
}

export default useDataRef;
