export const getPageData = async () => {
    const { host } = window.location;
    const splitHost = host.split('.');
    const isDev = host.includes('localhost');
  
    if (splitHost.length === 3 || (isDev && splitHost.length === 2)) {
      // This is your the subdomain
      // Ex. if foo.domain.com then page === 'foo'
      const page = splitHost[0];
      if (page === 'www') {
        return null;
      }
  
      // You can do your fetching logic here for each subdomain
  
      return page;
    }
  
    return null;
  };