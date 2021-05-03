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

export const sortArrayByProperty = (
  array,
  property,
  { type = 'number', direction = 1 }
) => {
  if (type === 'date')
    return array.sort(
      (a, b) =>
        (new Date(a[property]).getTime() - new Date(b[property]).getTime()) *
        direction
    )

  if (type === 'string')
    return array.sort((a, b) => {
      const valA = a[property],
        valB = b[property]

      if (typeof valA === 'string' && typeof valB === 'string')
        return valA.localeCompare(valB) * direction

      return 0
    })

  return array.sort((a, b) => {
    const valA = a[property],
      valB = b[property]

    if (typeof valA === 'number' && typeof valB === 'number')
      (valA - valB) * direction

    return 0
  })
}
