"use client";

import { useEnumStore } from "@/stores/use-enums-store";

import { usePerson } from "@/api/persons/use-person";
import { useQueryParams } from "@/hooks/use-query-params";

import { Separator } from "@/components/ui/separator";

import EntityTitle from "@/components/shared/EntityTitle";
import TabsFilter from "@/components/shared/TabsFilter";
import Toolbar from "@/components/shared/Toolbar";
import { DataTable } from "@/components/shared/DataTable";
import { personsColumns } from "@/components/persons/persons-columns";

import ERROR_MESSAGES from "@/constants/error-messages";
import { PERSON_FILTERS, PERSON_ROLE_ALL } from "@/constants/persons.constants";

const PersonsClient = () => {
  const sortFields = useEnumStore((s) => s.getByType("person_sort_fields"));
  const roles = useEnumStore((s) => s.getByType("person_role"));

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
        filterOptions={PERSON_FILTERS}
        onAdd={() => console.log("create new")}
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
