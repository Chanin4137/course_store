type CACHE_TAG = 'users' | 'categories' | 'courses' | 'orders'

export const getGlobalTag = (tag: CACHE_TAG) => {
    return `global_${tag}` as const // golbal:users
}


export const getIdTag = async (tag: CACHE_TAG, id: string) => {
    return `id:${id}-${tag}` as const // id:1234-users
}