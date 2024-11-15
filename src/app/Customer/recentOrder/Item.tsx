"use client";
import { api } from "~/trpc/react"

export default function Item({orderId}: {orderId: number[]}){
    const temp = api.menu.getMenuItemsByIds.useQuery( orderId )
    const temp2 = temp.data!
    return(
        <div>
        <div className="flex justify-between items-center">
            <p>
            </p>
            {/*<p className="text-right">${item.price.toFixed(2)}</p>*/}
        </div>
        { (
            <ul className="ml-4 mt-1 text-sm text-gray-500 list-disc">
                {temp2?.map((subItem, subIndex) => (
                    <li key={subIndex}>{subItem.name ?? "none"}</li>
                ))}
            </ul>
            
        )}
    </div>  
    );
}