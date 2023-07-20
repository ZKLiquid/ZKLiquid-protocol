import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as SyntrumLogo } from '../assets/svg/syntrum-footer-logo.svg';
import { ReactComponent as FaceBook } from '../assets/svg/facebook.svg';
import { ReactComponent as IG } from '../assets/svg/IG.svg';
import { ReactComponent as Twitter } from '../assets/svg/twitter.svg';
import { ReactComponent as GitHub } from '../assets/svg/github.svg';
import { ReactComponent as Behance } from '../assets/svg/behance.svg';

const Footer = () => {
  return (
    <footer className='bg-[#101115] mt-28 md:mt-0 p-4 md:p-8'>
      <div className='container mx-auto'>
        <div className='pt-8 pb-16 md:pt-28'>
          <div className='flex flex-col lg:flex-row gap-12 xl:gap-x-[106px] justify-between'>
            <div className='lg:max-w-[450px] w-full flex-shrink-0 lg:order-2'>
              <div className=''>
                <SyntrumLogo />
              </div>
              <div className='mt-3'>
                <p className='text-[#6D7A86] text-[16px] font-normal max-w-[325px]'>
                  A multichain blockchain for interconnected product in DeFi,
                  Gaming and NFT. The future of blockchain interoperability.
                </p>
              </div>

              <div className='mt-6 gap-5 cursor-pointer flex'>
                <FaceBook />
                <IG />
                <Twitter />
                <GitHub />
                <Behance />
              </div>
            </div>
            <div className='w-full lg:order-1'>
              <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-y-11 gap-x-12'>
                <div>
                  <p className='text-sm font-semibold text-white uppercase'>
                    Company
                  </p>
                  <ul className='mt-4 space-y-4 text-[13.5px] capitalize'>
                    <li>
                      <Link
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        About Us{' '}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/mobile-development'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Careers{' '}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/web-development'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Legal{' '}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Contact Us{' '}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className='text-sm font-semibold text-white uppercase'>
                    Products{' '}
                  </p>
                  <ul className='mt-4 space-y-4 capitalize text-[13.5px]'>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        DeFI{' '}
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        GameFi{' '}
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        NFT
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Wallet
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className='text-sm font-semibold text-white uppercase'>
                    Business{' '}
                  </p>

                  <ul className='mt-4 space-y-4 capitalize text-[13.5px]'>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Partnership{' '}
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        VC Proposal{' '}
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Marketing{' '}
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Others{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className='text-sm font-semibold text-white uppercase'>
                    dEVELOPment{' '}
                  </p>
                  <ul className='mt-4 space-y-4 text-[13.5px] capitalize'>
                    <li>
                      <Link
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Documentation{' '}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/mobile-development'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        dApp Integration{' '}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/web-development'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        Research Openings{' '}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text-[#6D7A86] transition-colors hover:text-gray-400'
                      >
                        SDK{' '}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='py-8 border-t border-white/10 '>
          <div className='flex flex-col items-center justify-center gap-6 md:flex-row'>
            <p className='text-[#6D7A86]'>
              © 2023 Syntrum. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
