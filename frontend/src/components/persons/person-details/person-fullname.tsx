import React from "react";

const PersonFullName = ({ fullName }: { fullName: string }) => {
  return (
    <div className="flex items-center gap-2.5">
      <p className="text-text-muted text-xs border-r w-32">Контрагент:</p>
      <p className="text-sm font-semibold">{fullName}</p>
    </div>
  );
};

export default PersonFullName;
