import axios from 'axios'

export async function getSingerList () {
  const resp = await axios.get('/singers')
  return resp.data
}
