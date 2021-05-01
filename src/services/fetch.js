/* eslint-disable prettier/prettier */
export const fetchDataAsync = async (url) => {
  const res = await fetch(url)
    .then(async (res) => await res.json())
    .then(async (data) => await data)
    .catch((err) => console.log(err.message))
  return res
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
