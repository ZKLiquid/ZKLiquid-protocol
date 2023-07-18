import { useState, useCallback } from 'react';

function useToggle(initState = false) {
  const [state, setState] = useState(initState);

  const toggle = useCallback(() => setState((s) => !s), []);

  return /** @type {[typeof state, typeof toggle, typeof setState]} */ ([
    state,
    toggle,
    setState,
  ]);
}

export default useToggle;
