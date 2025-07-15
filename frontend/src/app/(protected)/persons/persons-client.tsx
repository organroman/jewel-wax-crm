"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

import { usePerson } from "@/api/person/use-person";
import { useLocation } from "@/api/locations/use-location";
import { useQueryParams } from "@/hooks/use-query-params";

import { Separator } from "@/components/ui/separator";

import EntityTitle from "@/components/shared/entity-title";
import TabsFilter from "@/components/shared/tabs-filter";
import Toolbar from "@/components/shared/tool-bar";
import { DataTable } from "@/components/shared/data-table";

import ERROR_MESSAGES from "@/constants/error-messages";
import {
  STATIC_PERSON_FILTERS,
  PERSON_ROLE_ALL,
} from "@/constants/persons.constants";
import { useTranslation } from "react-i18next";
import { getPersonsColumns } from "@/components/persons/persons-columns";

import {
  translateFilterGroups,
  translateSingleLabel,
} from "@/lib/translate-constant-labels";
import { PERSON_SORT_FIELDS } from "@/constants/sortable-fields";
import { PERSON_ROLE_VALUES } from "@/constants/enums.constants";

const PersonsClient = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const personsColumns = getPersonsColumns(t);

  const sortOptions = PERSON_SORT_FIELDS.map((opt) => ({
    value: opt,
    label: t(`person.sorting.${opt}`),
  }));

  const [searchCity, setSearchCity] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const debouncedSearchCity = useMemo(
    () => debounce((value: string) => setDebouncedValue(value), 500),
    []
  );

  useEffect(() => {
    debouncedSearchCity(searchCity);
    return () => {
      debouncedSearchCity.cancel();
    };
  }, [searchCity, debouncedSearchCity]);

  const { data: cities, isLoading: citiesLoading } = useLocation.getCities({
    query: `search=${debouncedValue}`,
  });
  const { data: countries, isLoading: countriesLoading } =
    useLocation.getCountries();

  const staticFilters = translateFilterGroups(
    STATIC_PERSON_FILTERS,
    t,
    "person.filters"
  );

  const personFilters = [
    ...staticFilters,
    {
      param: "city",
      label: t("location.labels.city"),
      async: true,
      options:
        cities && cities.data.map((c) => ({ value: c.id, label: c.name })),
      isLoading: citiesLoading,
      searchQuery: searchCity,
      setSearchQuery: setSearchCity,
    },
    {
      param: "country",
      label: t("location.labels.country"),
      hasSearch: true,
      options:
        countries && countries.map((c) => ({ value: c.id, label: c.name })),
      isLoading: countriesLoading,
    },
  ];

  const roleAll = translateSingleLabel(PERSON_ROLE_ALL, t, "person.roles");

  const rolesWithAllOption = [
    {
      ...roleAll,
    },
    ...PERSON_ROLE_VALUES.map((role) => ({
      value: role,
      label: t(`person.roles.${role}`),
    })),
  ];

  const { page, limit, query, setParam, ready } = useQueryParams();

  const { data, isLoading, error } = usePerson.getPaginatedPersons({
    query,
    enabled: ready,
  });

  const { data: persons = [], total = 0 } = data ?? {};

  if (error) {
    return <p>{ERROR_MESSAGES.SOMETHING_WENT_WRONG}</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <TabsFilter param="role" options={rolesWithAllOption} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <Toolbar
        sortOptions={sortOptions}
        searchPlaceholder={t("person.placeholders.search_person")}
        addLabel={t("person.add_person")}
        filterPlaceholder={t("placeholders.filters")}
        filterOptions={personFilters}
        onAdd={() => router.push("persons/new")}
      />
      <div className="flex-1 overflow-hidden flex flex-col mt-4">
        <DataTable
          columns={personsColumns}
          data={persons}
          isLoading={isLoading}
          totalItems={total}
          currentLimit={limit}
          currentPage={page}
          onPageChange={(newPage) => setParam("page", newPage)}
        />
      </div>
    </div>
  );
};

export default PersonsClient;
