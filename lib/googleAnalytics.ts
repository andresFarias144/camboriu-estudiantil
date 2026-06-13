import 'server-only'

import { BetaAnalyticsDataClient } from '@google-analytics/data'

export type AnalyticsRow = {
  label: string
  value: number
}

export type AnalyticsOverview = {
  status: 'ready' | 'missing_config' | 'error'
  activeUsers: number
  sessions: number
  pageViews: number
  contacts: number
  topPages: AnalyticsRow[]
  topCountries: AnalyticsRow[]
  error?: string
}

const emptyOverview: AnalyticsOverview = {
  status: 'missing_config',
  activeUsers: 0,
  sessions: 0,
  pageViews: 0,
  contacts: 0,
  topPages: [],
  topCountries: [],
}

function parseMetric(value?: string | null) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function reportRows(
  rows: Array<{
    dimensionValues?: Array<{ value?: string | null }> | null
    metricValues?: Array<{ value?: string | null }> | null
  }> | null | undefined,
) {
  return (rows ?? []).map((row) => ({
    label: row.dimensionValues?.[0]?.value || 'Sin identificar',
    value: parseMetric(row.metricValues?.[0]?.value),
  }))
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!propertyId || !clientEmail || !privateKey) {
    return emptyOverview
  }

  try {
    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })
    const property = `properties/${propertyId}`
    const dateRanges = [{ startDate: '30daysAgo', endDate: 'today' }]

    const [summaryResult, eventsResult, pagesResult, countriesResult] = await Promise.all([
      client.runReport({
        property,
        dateRanges,
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: {
              values: ['contact', 'lead'],
            },
          },
        },
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 5,
      }),
    ])

    const summary = summaryResult[0].rows?.[0]?.metricValues
    const contacts = (eventsResult[0].rows ?? []).reduce(
      (total, row) => total + parseMetric(row.metricValues?.[0]?.value),
      0,
    )

    return {
      status: 'ready',
      activeUsers: parseMetric(summary?.[0]?.value),
      sessions: parseMetric(summary?.[1]?.value),
      pageViews: parseMetric(summary?.[2]?.value),
      contacts,
      topPages: reportRows(pagesResult[0].rows),
      topCountries: reportRows(countriesResult[0].rows),
    }
  } catch (error) {
    console.error('No se pudieron obtener los datos de Google Analytics:', error)

    return {
      ...emptyOverview,
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
