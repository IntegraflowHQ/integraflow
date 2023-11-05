import { matchPath, useLocation } from 'react-router-dom';

export const useIsMatchingLocation = () => {
  const location = useLocation();

  return (path: string, basePath?: string) => {
    const constructedPath = basePath
      ? new URL(`${basePath}/${path}`).pathname ?? ''
      : path;

    return !!matchPath(constructedPath, location.pathname);
  };
};
