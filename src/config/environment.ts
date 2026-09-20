function readEnvironmentValue(name: string) {
  return import.meta.env[name]?.trim() ?? ''
}

function readNumber(name: string, fallback: number) {
  const value = Number(readEnvironmentValue(name))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function replaceMapKey(tileUrl: string, apiKey: string) {
  return tileUrl.replace('{apiKey}', encodeURIComponent(apiKey))
}

const mapApiKey = readEnvironmentValue('VITE_MAP_API_KEY')

export const environment = Object.freeze({
  app: {
    environment: readEnvironmentValue('VITE_APP_ENV'),
    name: readEnvironmentValue('VITE_APP_NAME'),
  },
  api: {
    baseUrl: readEnvironmentValue('VITE_API_BASE_URL'),
    timeoutMs: readNumber('VITE_API_TIMEOUT_MS', 15_000),
  },
  map: {
    apiKey: mapApiKey,
    attribution: readEnvironmentValue('VITE_MAP_ATTRIBUTION'),
    maxZoom: readNumber('VITE_MAP_MAX_ZOOM', 19),
    provider: readEnvironmentValue('VITE_MAP_PROVIDER'),
    streetAttribution: readEnvironmentValue('VITE_MAP_STREETS_ATTRIBUTION'),
    streetTileUrl: replaceMapKey(readEnvironmentValue('VITE_MAP_STREETS_TILE_URL'), mapApiKey),
    tileUrl: replaceMapKey(readEnvironmentValue('VITE_MAP_TILE_URL'), mapApiKey),
  },
  features: {
    useMockData: readEnvironmentValue('VITE_ENABLE_MOCK_DATA') === 'true',
  },
})
