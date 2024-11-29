/* eslint-disable unicorn/prefer-top-level-await */
import { createService } from '../../packages/client/createService'
import { parseCliArguments } from '../../packages/process/parseCliArguments'
import { giphy } from './giphy'

async function main() {
  const { parameters } = parseCliArguments()
  const Giphy = createService(giphy, { token: process.env.GIPHY_API_KEY })
  const ghhifs = await Giphy.translateGif({ s: parameters.join(' ') })
  const ghhifsJson = JSON.stringify(ghhifs, undefined, 2)
  process.stdout.write(`${ghhifsJson}\n`)
}

void main()
