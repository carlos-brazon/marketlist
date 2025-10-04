function CardProduct({ product, oneItem }) {
  const sizeImgProduct = oneItem ? 'xs:w-36 xs:h-36 w-28 h-28' : 'xs:w-16 xs:h-16 w-12 h-12'
  const item = product || oneItem  
  
  return (
    <>
      <div className={`${item?.display_name.length > 20 ? 'line-clamp-4' : ''} text-[10px]  xs:text-sm`}>{item?.display_name}</div>
      <div className='flex items-center justify-center'>
        <img className={sizeImgProduct} src={item?.thumbnail} alt="" />
        <div className='text-[10px] xs:text-sm'>€: {item?.price_instructions?.unit_price}</div>
      </div>
    </>

  )
}

export default CardProduct
