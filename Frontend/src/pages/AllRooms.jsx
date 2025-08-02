import React, { useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import StarRating from '../components/StarRating';
import { useNavigate } from 'react-router-dom'

const CheckBox =({label, selected = false, onchange= () => {}})=>{

    return(
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type="checkbox" checked={selected} onChange={(e)=>onChange(e.target.checked,label)}  />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton =({label, selected = false, onchange= () => {}})=>{

    return(
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type="radio" name="sortOptions" checked={selected} onChange={()=>onChange(label)}  />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const AllRooms = () => {

const navigate = useNavigate();
const [openFilters, setOpenFilters] = useState(false)

const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Family Suite",
    "Luxury Room"
];

const priceRanges = [
    "Rs. 0 to Rs. 10000",
    "Rs. 10000 to Rs. 20000",
    "Rs. 20000 to Rs. 30000",
    "Above Rs. 30000"
];

const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
];



  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        <div>
            <div className='flex flex-col items-start text-left'>
                <h1 className='font-playfair text-4xl md:text-[40px]'>Our Rooms</h1>
                <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-175'>Browse all available rooms in our hotel. Each room is designed for your comfort and relaxation.</p>
            </div>

            {roomsDummyData.map((room)=> (
                <div key={room._id} className='flex flex-col md:flex-row item-start py-10 gap-6 boarder-b border-gray-300 last:pb-30 last:border-0' >
                    <img onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0,0)}}
                    src={room.images[0]} alt="Room img" title='View Room Details'
                    className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />

                    <div className='md:w-1/2 flex flex-col gap-2'>
                        <p className='text-gray-800 text-3xl font-playfair cursor-pointer' onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0,0)}}>{room.roomType}</p>
                        <div className='flex items-center'>
                            <StarRating />
                            <p className='ml-2'>200+ reviews</p>
                        </div>
                        {/*Room Amenities*/}
                        <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                            {room.amenities.map((item, index)=>(
                                <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5FSFF]/70'>
                                    <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                    <p className='text-xs'>{item}</p>
                                </div>
                            ))}
                        </div>
                        {/*Room Price*/}
                        <p className='text-xl font-medium text-gray-700'>Rs.{room.pricePerNight} /night</p>
                    </div>
                </div>
            ))}

        </div>

        {/*Filter Section*/}
        <div className='bg-white w-80 border border-gray-300 text-gray-700 max-lg:mb-8 min-lg:mt-16'>
            <div className={'flex items-center justify-between px-5 py-2.5 min_lg:border-b border-gray-300 ${openFilters && "border-b"}'}>
                <p className='text-base font-medium text-gray-700'>Filter by:</p>
                <div className='text-xs cursor-pointer '>
                    <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                        {openFilters?"Hide":"Show"} </span>
                    <span className='hidden lg:block'>Clear</span>
                </div>
            </div>

            <div className={` ${openFilters ? 'h-auto' : "h-0 lg:h-auto"}
                 overflow-hidden transition-all duration-700`}>

                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-700 pb-2'>Popular filters</p>
                        {roomTypes.map((room, index) =>(
                            <CheckBox key={index} label={room} />
                        ))}
                    </div>

                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-700 pb-2'>Price Range</p>
                        {priceRanges.map((range, index) =>(
                            <CheckBox key={index} label={`${range}`} />
                        ))}
                    </div>

                    <div className='px-5 pt-5 pb-7'>
                        <p className='font-medium text-gray-700 pb-2'>Sort By</p>
                        {sortOptions.map((option, index) =>(
                            <RadioButton key={index} label={option} />
                            
                        ))}
                    </div>

                    
                 </div>


        </div>
    </div>
  )
}

export default AllRooms