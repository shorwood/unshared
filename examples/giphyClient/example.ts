import { createClient } from '../../packages/client/createClient'
import { giphy } from './giphy'

function main() {
  return createClient(giphy)
    .searchGifs({
      data: {
        q: process.argv.slice(2).join(' '),
        api_key: 'BP7HwKDqtLAyRV3FCXY5F7fDs4AMgocX',
      },
    })
    .catch(console.error)
    // eslint-disable-next-line no-console
    .then(data => console.debug(data?.data))
}

void main()
