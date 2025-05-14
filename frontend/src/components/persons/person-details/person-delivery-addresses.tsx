import { DeliveryAddress } from "@/types/person.types";
import React from "react";
import PersonLabeledList from "./person-labeled-list";

interface PersonDeliveryAddressesProps {
  addresses: DeliveryAddress[];
}

const PersonDeliveryAddresses = ({
  addresses,
}: PersonDeliveryAddressesProps) => {
  const delAddresses = addresses.map((address) => ({
    id: address.id || 1,
    value: address.address_line,
    isMain: address.is_main
  }));
  return (
    <div className="mt-10">
      <p className="text-sm font-medium pb-2 border-b border-ui-border">
        Адреса доставки
      </p>
      <PersonLabeledList
        mainLabel="Основна адреса :"
        secondaryLabel="Інша адреса :"
        items={delAddresses}
        width="w-50"
      />
    </div>
  );
};

export default PersonDeliveryAddresses;
