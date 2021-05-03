/* eslint-disable prettier/prettier */
export const fetchDataAsync = async (url) => {
  const res = await fetch(url)
  const response = await res.json()
  return response
}

export const fetchDataPromise = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
