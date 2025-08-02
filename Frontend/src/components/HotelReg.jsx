
import React, { useState } from 'react';
import { assets } from '../assets/assets';

const HotelReg = () => {
  const [roomType, setRoomType] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(0);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
      <form className='flex flex-col gap-6 bg-white rounded-xl p-8 w-full max-w-lg shadow-xl'>

        <div className='flex items-center gap-3'>
          <img src={assets.listIcon} alt='room icon' className='h-6 w-6' />
          <label htmlFor='roomType' className='font-medium text-gray-700'>Room</label>
        </div>
        <input
          id='roomType'
          type='text'
          placeholder='Type here (e.g. Double Bed, Family Suite)'
          className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
          value={roomType}
          onChange={e => setRoomType(e.target.value)}
        />

        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <img src={assets.calenderIcon} alt='calendar icon' className='h-5 w-5' />
              <label htmlFor='checkin' className='font-medium text-gray-700'>Check in</label>
            </div>
            <input
              id='checkin'
              type='date'
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              placeholder='dd/mm/yyyy'
            />
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <img src={assets.calenderIcon} alt='calendar icon' className='h-5 w-5' />
              <label htmlFor='checkout' className='font-medium text-gray-700'>Check out</label>
            </div>
            <input
              id='checkout'
              type='date'
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              placeholder='dd/mm/yyyy'
            />
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <img src={assets.guestsIcon} alt='guest icon' className='h-6 w-6' />
          <label htmlFor='guests' className='font-medium text-gray-700'>Guests</label>
          <input
            id='guests'
            type='number'
            min='0'
            className='border border-gray-200 rounded w-24 px-3 py-2.5 ml-2 outline-indigo-500 font-light'
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
          />
        </div>

        <button type='submit' className='flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-all text-white px-6 py-2 rounded cursor-pointer mt-2'>
          <img src={assets.searchIcon} alt='search icon' className='h-5 w-5' />
          Search
        </button>
      </form>
    </div>
  );
};

export default HotelReg;