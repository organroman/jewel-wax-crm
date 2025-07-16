"use client";

import { Order } from "@/types/order.types";

import { useTranslation } from "react-i18next";

import OrderCardHeader from "./order-card-header";

import InfoLabel from "../shared/typography/info-label";
import InfoValue from "../shared/typography/info-value";

interface OrderInfoProps {
  order: Order;
}

const OrderInfo = ({ order }: OrderInfoProps) => {
  const { t } = useTranslation();

  const images = order.media.filter((m) => m.type === "image");

  const mainImage = images.find((i) => i.is_main) ?? images[0];
  const otherImages = images.filter((i) => !i.is_main);

  return (
    <div className="w-full h-full flex flex-col gap-4 rounded-md">
      <OrderCardHeader order={order} />
      <div className="flex flex-row gap-5 p-5 ">
        <div className="w-2/5 flex-flex-col gap-5 ">
          <div className="w-full h-45 p-2.5 bg-ui-column rounded-md flex justify-center items-center text-center">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt=""
                className="h-full aspect-auto rounded-md self-center"
              />
            ) : (
              <span className="text-text-muted text-sm">
                {t("messages.info.no_image")}
              </span>
            )}
          </div>
          {!!otherImages.length && (
            <div className="mt-5 pb-4 flex flex-row w-full gap-2.5 overflow-x-auto scroll-on-hover scrollbar-thin">
              {otherImages.map((i) => (
                <div
                  key={i.id}
                  className="h-16 rounded-md shrink-0 bg-ui-column flex items-center justify-center"
                >
                  <img
                    src={i?.url}
                    className="h-full aspect-auto rounded-md "
                    alt={`image`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-3/5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <InfoLabel>{t("order.labels.name")}:</InfoLabel>
            <InfoValue className="ml-2.5">{order.name}</InfoValue>
          </div>
          <div className="flex flex-col gap-2">
            <InfoLabel>{t("order.labels.desc")}:</InfoLabel>
            <InfoValue className="ml-2.5">{order.description}</InfoValue>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
