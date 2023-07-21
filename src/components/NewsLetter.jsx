import React from 'react';
import Input from './Input';

const NewsLetter = () => {
  return (
    <div className='mt-20'>
      <div className='font-semibold text-[22px] font-Poppins leading-[33px] text-center'>
        <h3>Updates Subscription!</h3>
        <h3>Never miss our latest updates!</h3>
      </div>

      <div className='gap-4 flex flex-col md:flex-row justify-center mt-10'>
        <input
          name='email'
          // value={formValues.email}
          // onChange={handleInputChange}
          className='py-3 rounded-lg pr-56 pl-6'
          type='text'
          placeholder='Enter your email'
        />

        <button
          className='bg-[#FD6221] shadow-boxShadows bg-gradient-to-r from-[#FD6221] to-[#FB167C] rounded-lg py-3 px-3'
          type='submit'
        >
          Notify me
        </button>
      </div>

      <div className='md:text-center md:mr-40'>
        <p className='text-[12px] text-[#9BA6B7] font-medium pt-2'>
          We care about the protection of your data. Read our{' '}
          <span className='text-[#3772FF]'>Privacy Policy.</span>{' '}
        </p>
      </div>
    </div>
  );
};

export default NewsLetter;
