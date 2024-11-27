import { createService } from '../../packages/client/createService'
import { parseCliArguments } from '../../packages/process/parseCliArguments'
import { giphy } from './giphy'

function main() {
  const { options } = parseCliArguments()
  const Giphy = createService(giphy)
  const ghhifs = Giphy.searchGifs({ q: 'cats', ...options })
  const ghhifsJson = JSON.stringify(ghhifs)
  process.stdout.write(ghhifsJson)
}

main()
