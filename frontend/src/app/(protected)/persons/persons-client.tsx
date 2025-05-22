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
import { personsColumns } from "@/components/persons/persons-columns";

import ERROR_MESSAGES from "@/constants/error-messages";
import {
  STATIC_PERSON_FILTERS,
  PERSON_ROLE_ALL,
} from "@/constants/persons.constants";

const PersonsClient = () => {
  const router = useRouter();
  const sortFields = useEnumStore((s) => s.getByType("person_sort_fields"));
  const roles = useEnumStore((s) => s.getByType("person_role"));
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

  const personFilters = [
    ...STATIC_PERSON_FILTERS,
    {
      param: "city",
      label: "Місто",
      async: true,
      options:
        cities && cities.data.map((c) => ({ value: c.id, label: c.name })),
      isLoading: citiesLoading,
      searchQuery: searchCity,
      setSearchQuery: setSearchCity,
    },
    {
      param: "country",
      label: "Країна",
      hasSearch: true,
      options:
        countries && countries.map((c) => ({ value: c.id, label: c.name })),
      isLoading: countriesLoading,
    },
  ];

  const rolesWithAllOption = [PERSON_ROLE_ALL, ...roles];

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
      <EntityTitle title="Контрагенти" />
      <TabsFilter param="role" options={rolesWithAllOption} />
      <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
      <Toolbar
        sortOptions={sortFields}
        searchPlaceholder="Пошук контрагента"
        addLabel="Додати контрагента"
        filterOptions={personFilters}
        onAdd={() => router.push("persons/new")}
      />
      <div className="flex-1 overflow-hidden flex flex-col mt-2">
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
