/* eslint-disable prettier/prettier */
export const compareUsers = (a, b) => {
  if (a.employeeId < b.employeeId) {
    return -1
  }
  if (a.employeeId > b.employeeId) {
    return 1
  }
  return 0
}
