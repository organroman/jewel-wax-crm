import { useTranslation } from "react-i18next";

import { DeliveryAddress } from "@/types/person.types";

import PersonLabeledList from "./person-labeled-list";
import { getDoorAddress } from "@/lib/utils";

interface PersonDeliveryAddressesProps {
  addresses: DeliveryAddress[];
}

const PersonDeliveryAddresses = ({
  addresses,
}: PersonDeliveryAddressesProps) => {
  const { t } = useTranslation();
  const delAddresses = addresses.map((address) => {
    const label =
      address.type === "warehouse"
        ? address.np_warehouse
        : getDoorAddress(
            address.street,
            address.house_number,
            address.flat_number
          );

    return {
      id: address.id || 1,
      value: label ?? "",
      isMain: address.is_main,
    };
  });
  return (
    <div className="mt-10">
      <p className="text-sm font-medium pb-2 border-b border-ui-border">
        {t("person.delivery_address")}
      </p>
      <PersonLabeledList
        mainLabel={`${t("person.labels.main_location")}:`}
        secondaryLabel={`${t("person.labels.extra_location")}:`}
        items={delAddresses}
        width="w-50"
      />
    </div>
  );
};

export default PersonDeliveryAddresses;
