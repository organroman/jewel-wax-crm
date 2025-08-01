"use client";
import { Person } from "@/types/person.types";

import Image from "next/image";

import { Separator } from "../ui/separator";

import PersonMetaHeader from "./person-details/person-meta-header";
import PersonFullName from "./person-details/person-fullname";
import PersonLabeledList from "./person-details/person-labeled-list";
import PersonType from "./person-details/person-type";
import PersonContacts from "./person-details/person-contacts";
import PersonDeliveryAddresses from "./person-details/person-delivery-addresses";
import PersonBankDetails from "./person-details/person-bank";

import {
  formatPhone,
  getFullName,
  getInitials,
  getMessengerIcon,
} from "@/lib/utils";
import CustomAvatar from "../shared/custom-avatar";
import { useTranslation } from "react-i18next";
import LabelPDF from "./label-pdf";
import { pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";

interface PersonInfoProps {
  person: Person;
}

const PersonInfo = ({ person }: PersonInfoProps) => {
  const { t } = useTranslation();
  const phones = person.phones.map((phone) => ({
    id: phone.id!,
    value: formatPhone(phone.number),
    isMain: phone.is_main,
    icons: person.messengers
      ?.filter((m) => m.phone_id === phone.id)
      .map((m) => {
        const icon = getMessengerIcon(m.platform);
        return icon ? (
          <Image
            key={m.id}
            src={icon}
            alt={m.platform}
            width={20}
            height={20}
          />
        ) : null;
      }),
  }));

  const locations = person.locations?.map((loc) => ({
    id: loc.id,
    value: `${t("dictionary.city_short")}${loc?.city_name}, ${
      loc?.country_name
    }`,
    isMain: loc.is_main,
  }));

  const emails = person.emails?.map((email) => ({
    id: email.id,
    value: email.email,
    isMain: email.is_main,
  }));

  const handlePrint = async () => {
    if (!person) {
      return;
    }
    const fullName = getFullName(
      person.first_name,
      person.last_name,
      person.patronymic
    );
    const mainPhone = person.phones.find((phone) => phone.is_main === true);
    if (!mainPhone) return;
    const blob = await pdf(
      <LabelPDF
        name={fullName}
        phone={mainPhone.number}
        date={dayjs(new Date()).format("DD.MM.YYYY HH:MM")}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="w-full h-full rounded-md">
      <div className="w-full h-fit flex flex-col lg:flex-row gap-4">
        <div className="flex-2 flex flex-col lg:border-r border-ui-border">
          <PersonMetaHeader
            createdAt={person.created_at}
            isActive={person.is_active}
            id={person.id}
            handlePrint={handlePrint}
          />
          <div className="flex flex-col lg:flex-row w-full mt-6 gap-12">
            <div className="flex justify-center">
              <CustomAvatar
                className="w-37 h-37 "
                avatarUrl={person?.avatar_url}
                fallback={
                  person
                    ? getInitials(person?.last_name, person?.first_name)
                    : ""
                }
                fallbackClassName="text-6xl"
              />
            </div>
            <div className="w-full">
              <PersonFullName
                fullName={getFullName(
                  person.first_name,
                  person.last_name,
                  person.patronymic,
                  true
                )}
              />
              <PersonLabeledList
                mainLabel={`${t("person.labels.phone_number")}:`}
                secondaryLabel={`${t("person.labels.extra_phone_number")}:`}
                highlightMain
                items={phones}
              />

              {locations && locations.length > 0 && (
                <PersonLabeledList
                  mainLabel={`${t("person.labels.main_location")}:`}
                  secondaryLabel={`${t("person.labels.extra_location")}:`}
                  items={locations}
                />
              )}
              <PersonType value={person.role.value} label={person.role.label} />
              {emails && emails?.length > 0 && (
                <PersonLabeledList
                  mainLabel={`${t("person.labels.main_email")}:`}
                  secondaryLabel={`${t("person.labels.extra_email")}:`}
                  items={emails}
                />
              )}
            </div>
          </div>
        </div>
        <Separator className="border-ui-border w-1" orientation="vertical" />
        <div className="flex-1">
          <p className="text-sm font-medium text-text-regular">
            {t("person.connected_contacts")}:
          </p>
          {person.contacts && person.contacts.length > 0 && (
            <PersonContacts contacts={person.contacts} />
          )}
        </div>
      </div>
      {person.delivery_addresses && person.delivery_addresses?.length > 0 && (
        <PersonDeliveryAddresses addresses={person.delivery_addresses || []} />
      )}
      {person.bank_details && person.bank_details?.length > 0 && (
        <PersonBankDetails bankDetails={person.bank_details} />
      )}
    </div>
  );
};

export default PersonInfo;
