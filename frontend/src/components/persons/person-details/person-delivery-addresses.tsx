import { useTranslation } from "react-i18next";

import { DeliveryAddress } from "@/types/person.types";

import PersonLabeledList from "./person-labeled-list";

interface PersonDeliveryAddressesProps {
  addresses: DeliveryAddress[];
}

const PersonDeliveryAddresses = ({
  addresses,
}: PersonDeliveryAddressesProps) => {
  const { t } = useTranslation();
  const delAddresses = addresses.map((address) => ({
    id: address.id || 1,
    value: address.address_line,
    isMain: address.is_main,
  }));
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
