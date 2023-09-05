export default interface NavigationItem {
  icon: string,
  items?: Record<string, NavigationItem>;
  name: string,
  permissions: string[],
  roles: string[],
  route: string | null,
  slug: string,
  //aliases is set in one item but not used. Check if it's realy necessary
  aliases?: string[];
}