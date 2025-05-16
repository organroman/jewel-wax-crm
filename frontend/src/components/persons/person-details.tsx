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

interface PersonDetailsProps {
  person: Person;
}

const PersonDetails = ({ person }: PersonDetailsProps) => {
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
    value: `м.${loc?.city_name}, ${loc?.country_name}`,
    isMain: loc.is_main,
  }));

  const emails = person.emails?.map((email) => ({
    id: email.id,
    value: email.email,
    isMain: email.is_main,
  }));

  return (
    <div className="w-full h-full bg-white rounded-md">
      <div className="w-full h-fit flex gap-4">
        <div className="flex-2 border-r border-ui-border">
          <PersonMetaHeader
            createdAt={person.created_at}
            isActive={person.is_active}
            id={person.id}
          />
          <div className="flex w-full mt-6 gap-12">
            <CustomAvatar
              className="w-37 h-37"
              avatarUrl={person?.avatar_url}
              fallback={
                person ? getInitials(person?.last_name, person?.first_name) : ""
              }
              fallbackClassName="text-6xl"
            />
            <div className="w-full">
              <PersonFullName
                fullName={getFullName(
                  person.first_name,
                  person.last_name,
                  person.patronymic
                )}
              />
              <PersonLabeledList
                mainLabel="Номер телефону:"
                secondaryLabel="Інший ном. тел.:"
                highlightMain
                items={phones}
              />

              {locations && locations.length > 0 && (
                <PersonLabeledList
                  mainLabel="Основна адреса:"
                  secondaryLabel="Інша адреса:"
                  items={locations}
                />
              )}
              <PersonType value={person.role.value} label={person.role.label} />
              {emails && emails?.length > 0 && (
                <PersonLabeledList
                  mainLabel="Основний email:"
                  secondaryLabel="Інший email:"
                  items={emails}
                />
              )}
            </div>
          </div>
        </div>
        <Separator className="border-ui-border w-1" orientation="vertical" />
        <div className="flex-1">
          <p className="text-sm font-medium">Прив'язані контакти:</p>
          {person.contacts && person.contacts.length > 0 && (
            <PersonContacts contacts={person.contacts} />
          )}
        </div>
      </div>
      {person.delivery_addresses && person.delivery_addresses?.length > 0 && (
        <PersonDeliveryAddresses addresses={person.delivery_addresses || []} />
      )}
      {person.bank_details && (
        <PersonBankDetails bankDetails={person.bank_details} />
      )}
    </div>
  );
};

export default PersonDetails;
