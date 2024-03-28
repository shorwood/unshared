import { capitalize } from './../../../packages/shared'
import metadata from './metadata.json'

export const getSidebarModules = () =>
  metadata.map(x => ({
    text: capitalize(x[0].name).replace('css', 'CSS'),
    link: `/api/${x[0].name}`,
  }))
