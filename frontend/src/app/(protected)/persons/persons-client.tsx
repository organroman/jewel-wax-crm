"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

import { useEnumStore } from "@/stores/use-enums-store";

import { usePerson } from "@/api/persons/use-person";
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

const PersonsClient = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const personsColumns = getPersonsColumns(t);

  const sortFields = useEnumStore((s) => s.getByType("person_sort_fields"));
  const roles = useEnumStore((s) => s.getByType("person_role"));

  const sortOptions = sortFields.map((opt) => ({
    ...opt,
    label: t(`person.sorting.${opt.value}`),
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

  const { data: cities, isLoading: citiesLoading } = useLocation.getCities(
    `search=${debouncedValue}`
  );
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
    ...roles.map((role) => ({
      ...role,
      label: t(`person.roles.${role.value}`),
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
      <div className="hidden lg:flex">
        <EntityTitle title={t("person.person_plural")} />
      </div>
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
