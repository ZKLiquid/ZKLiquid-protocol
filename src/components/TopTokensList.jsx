import React from 'react';

import { bridge, table } from '@/constant/globalConstants';
import SearchBar from '@/components/SearchBar';

function TopTokensList() {
  return (
    <div className="pt-10">
      <div className="flex justify-between items-end">
        <h3 className="text-[#FFFFFF] text-[16px] font-bold">Top Tokens</h3>
        <SearchBar />
      </div>

      <div className="border border-b-[1px] border-[#20212C] my-4"></div>

      <div className="px-6 py-1 font-Roboto max-h-[754px] bg-[#191A1F] rounded-xl pb-14">
        <table className="min-w-full mt-2">
          <thead className="text-[12px] font-bold px-2 py-3 text-[#FFF] capitalize">
            <tr>
              <th scope="col" className="text-left">
                Token Name
              </th>
              <th scope="col" className="text-right">
                Price
              </th>
              <th scope="col" className="text-right">
                Volume (24H)
              </th>
              <th scope="col" className="text-right">
                Price Change
              </th>
            </tr>
          </thead>

          <tbody className="text-[#D6D7D9] font-bold py-4 text-[14px] whitespace-nowrap">
            {table.map((row, index) => (
              <tr key={index} className="border-b-[2px] border-[#20212C]">
                <td className="py-4 flex items-center gap-2 text-[14px]">
                  <img src={row.icon} alt="" />
                  {row.tokenName}
                </td>
                <td className="text-right">
                  <p>{row.price}</p>
                </td>
                <td className="text-right">
                  <p>{row.volume}</p>
                </td>
                <td className="text-right text-[#23DB9F]">{row.priceChange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopTokensList;
