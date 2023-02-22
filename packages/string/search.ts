import { Collection } from "@unshared/types/Collection"

export interface SearchOptions {
  /**
   * If the pool is a collection of objects, this is the path to the string to search
   * on, or an array of paths to search on multiple properties. The paths are
   * dot-separated, e.g. `user.name` and can include array indices, e.g. `users.0.name`
   * as well as wildcards, e.g. `users.*.name`.
   *
   * You can also pass an array of paths to search multiple properties. If the pool is
   * an array of strings, this option is ignored. By default, the search will search all
   * properties of an object.
   *
   * @example 'orders.*.name'
   */
  paths?: string | string[]
  /**
   * The maximum number of results to return. This is useful for limiting the
   * number of results returned when the pool is large. If the limit is reached,
   * the search will stop early.
   * 
   * @default Number.MAX_SAFE_INTEGER
   */
  limit?: number
  /**
   * The minimum score a result must have to be returned (0-1).
   * This parameter controls how strict the fuzzy search is, where 0 is loose and 1 is strict.
   * 
   * @default 0.3
   */
  minScore?: number
  /**
   * The minimum length a result must have to be returned. This is useful for filtering out
   * results that are too short to be relevant.
   * 
   * @default 3
   */
  minLength?: number
  /**
   * Force the search to be case sensitive.
   * 
   * @default false
   */
  isCaseSensitive?: boolean
}

export interface SearchResult<T> {
  /**
   * The string that was matched.
   */
  match: T
  /**
   * The index of the match in the pool.
   */
  matchIndex: number
  /**
   * The path at which the match was found in the pool.
   */
  matchPath?: string
  /**
   * The index of the match in the search string.
   */
  searchIndex: number
  /**
   * The score of the match (0-1).
   */
  score: number
}

/**
 * Searches for a given substring in a string and return an array of all matches.
 * 
 * @param pool The collection to search.
 * @param options The search options.
 */
export const search = <T extends object | string>(
  search: string | string[],
  pool: Collection<T>,
  options: SearchOptions = {}
): SearchResult<T>[] => {
  // --- Destructure options.
  const {
    paths = '*',
    limit = Number.MAX_SAFE_INTEGER,
    minScore = 0.3,
    minLength = 3,
    isCaseSensitive = false,
  } = options

  // --- Validate options.
  if (typeof search !== 'string' && !Array.isArray(search))
    throw new TypeError('Expected search to be a string or an array of strings')
  if (typeof pool !== 'object' || pool === null)
    throw new TypeError('Expected pool to be an object')
  if (typeof paths !== 'string' && !Array.isArray(paths))
    throw new TypeError('Expected paths to be a string or an array of strings')
  if (typeof limit !== 'number')
    throw new TypeError('Expected limit to be a number')
  if (typeof minScore !== 'number')
    throw new TypeError('Expected minScore to be a number')
  if (typeof minLength !== 'number')
    throw new TypeError('Expected minLength to be a number')
  if (typeof isCaseSensitive !== 'boolean')
    throw new TypeError('Expected isCaseSensitive to be a boolean')

  // --- Cast to arrays.
  const searches = Array.isArray(search) ? search : [search]
  const pathsArray = Array.isArray(paths) ? paths : [paths]
  const poolArray = Array.isArray(pool) ? pool : Object.values(pool)

  // --- Initialize results.
  const results: SearchResult<T>[] = []

  // --- Loop through pool.
  for (let i = 0; i < poolArray.length; i++) {
    // --- Get item.
    const item = poolArray[i]

    // --- Loop through searches.
    for (let j = 0; j < searches.length; j++) {
      // --- Get search.
      const search = searches[j]

      // --- Loop through paths.
      for (let k = 0; k < pathsArray.length; k++) {
        // --- Get path.
        const path = pathsArray[k]

        // --- Get value.
        const value = get(item, path)

        // --- If value is not a string, continue.
        if (typeof value !== 'string') continue

        // --- Get matches.
        const matches = fuzzySearch(search, value, {
          isCaseSensitive,
          minScore