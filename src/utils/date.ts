import { STORAGE_CONFIG } from '@/config/constants'
import { error } from '@/services/logging'

const digitsMap: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
}

const monthMap: Record<string, string> = {
  জানুয়ারি: 'january',
  ফেব্রুয়ারি: 'february',
  মার্চ: 'march',
  এপ্রিল: 'april',
  মে: 'may',
  জুন: 'june',
  জুলাই: 'july',
  আগস্ট: 'august',
  সেপ্টেম্বর: 'september',
  অক্টোবর: 'october',
  নভেম্বর: 'november',
  ডিসেম্বর: 'december',
}

function parseBnDateString(text: string): Date {
  const getFallbackDate = () => new Date(Date.now() + STORAGE_CONFIG.BLACKLIST_PURGE_AGE_MS)

  if (!text || typeof text !== 'string') {
    return getFallbackDate()
  }

  try {
    const pattern = new RegExp(Object.keys(monthMap).join('|'), 'g')
    const normalized = text
      .replace(pattern, m => monthMap[m])
      .replace(/[০১২৩৪৫৬৭৮৯]/g, d => digitsMap[d])

    const parsedDate = new Date(normalized)
    if (Number.isNaN(parsedDate.getTime())) {
      return getFallbackDate()
    }

    return parsedDate
  }
  catch (e) {
    error(`Failed to parse Bengali date string: "${text}". Using fallback.`, e)
    return getFallbackDate()
  }
}

export {
  parseBnDateString,
}
