export const convertRoleIdToString = (roleId) => {
  switch (roleId) {
    case 0:
      return "Brewer";
    case 1:
      return "Distributor";
    case 2:
      return "Wholesaler";
    case 3:
      return "Vendor";
    case 4:
      return "Market";
    default:
      return "Unknown";
  }
}
