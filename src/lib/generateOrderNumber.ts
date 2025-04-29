export const generateOrderNumber = () => {
    const prefix = 'ORD'
    const timestamp = new Date().getTime().toString().substring(3, 10)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')

    const orderNumber = `${prefix}${timestamp}${random}`

    return orderNumber
}