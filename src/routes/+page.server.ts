import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load:PageServerLoad = async ({ params }) => {
  const results = await db.query.guide.findMany()
  return {
    guides: results
  }
}
