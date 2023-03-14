export default function useRouteParser() {

  const routeDottedToSlash = (pathToParse: string, prefixSlash: boolean = true) => {
    let route = '';
    if (prefixSlash) {
      route = '/';
    }
    return route + pathToParse.replaceAll('.', '/');
  }

  const routeSlashToDotted = (pathToParse: string) => {
    let newPath = pathToParse.replaceAll('/', '.');

    // Remove first dot if it exist (28 Feb. 2023  Martin Henrichs)
    newPath = (newPath.slice(0, 1) === '.' ? newPath.slice(1) : newPath)
    return newPath;
  }

  const routeRemoveCRUD = (pathToParse: string) => {
    // Remove CRUD slugs from route. Current only for edit and create (01 März 2023  Martin Henrichs)
    let newPath = pathToParse.replace(/\.(edit|create).*/, '');
    return newPath;
  }

  return {
    routeDottedToSlash,
    routeSlashToDotted,
    routeRemoveCRUD
  }
}
