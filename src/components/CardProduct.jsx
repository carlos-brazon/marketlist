function CardProduct({ product, oneItem }) {
  const sizeImgProduct = oneItem ? 'xs:w-52 xs:h-52 w-48 h-48' : 'xs:w-16 xs:h-16 w-12 h-12'
  const sizeText =  oneItem ? 'text-sm' : 'text-[10px]'
  const item = product || oneItem  
  
  return (
    <>
      <div className={`${item?.display_name.length > 20 ? 'line-clamp-4' : ''} ${sizeText}  xs:text-sm`}>{item?.display_name}</div>
      <div className='flex items-center justify-center'>
        <img className={sizeImgProduct} src={item?.thumbnail} alt="" />
        <div className={`${sizeText} xs:text-sm`}>€: {item?.price_instructions?.unit_price}</div>
      </div>
    </>

  )
}

export default CardProduct
