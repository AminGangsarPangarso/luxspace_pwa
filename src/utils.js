export function numberFormat (price){
    const rupiah =Intl.NumberFormat("id-ID",{
        style:'currency',
        currency:'IDR'
    })
    return rupiah.format(price)
}
