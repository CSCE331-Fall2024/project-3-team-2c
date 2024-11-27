"use client";
import { api } from "~/trpc/react";

export default function Container({
  mainList,
  sideList,
  sizeId,
}: {
  mainList: number[];
  sideList: number[];
  sizeId: number;
}) {
  const temp = api.menu.getMenuItemsByIds.useQuery(mainList);
  const main = temp.data!;
  const temp2 = api.menu.getMenuItemsByIds.useQuery(sideList);
  const side = temp2.data!;
  const temp3 = api.containers.getSizeFromId.useQuery(sizeId);
  const sizeType = temp3.data!;
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">
          {sizeType?.name ? sizeType.name : "none"}
        </p>
        {/*<p className="text-right">${item.price.toFixed(2)}</p>*/}
      </div>
      {
        <ul className="ml-4 mt-1 list-disc text-sm text-gray-500">
          {main?.map((subItem, subIndex) => (
            <li key={subIndex}>{subItem.name ?? "none"}</li>
          ))}
          {side?.map((subItem, subIndex) => (
            <li key={subIndex}>{subItem.name ?? "none"}</li>
          ))}
        </ul>
      }
    </div>
  );
}
