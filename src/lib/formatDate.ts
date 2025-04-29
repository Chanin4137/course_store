import dayjs from '@/lib/dayjs'

export const formatDate = (date: Date | null | undefined) => {
    if (!date) return ''

    return dayjs(date).format('DD/MM/YYYY HH:mm')
}