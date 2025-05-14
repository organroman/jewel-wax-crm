"use client";

import { BankDetails } from "@/types/person.types";

import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";

interface PersonBankDetailsProps {
  bankDetails: BankDetails[];
}

const PersonBankDetails = ({ bankDetails }: PersonBankDetailsProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const titleStyles = "text-xs/5 w-32 text-text-muted ";
  const valueStyles = "text-sm font-medium";

  const handleCopy = async (value: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(value);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="mt-10">
      <p className="text-sm font-medium pb-2 border-b border-ui-border">
        Банківські реквізити
      </p>
      <div className="flex mt-2.5 gap-16">
        {bankDetails.map((bd) => (
          <div key={bd.id} className="flex gap-2.5 items-center ">
            <div className="flex flex-col gap-1 border-r border-ui-border justify-center">
              {bd.bank_name && <p className={titleStyles}>Банк:</p>}
              {bd.card_number && <p className={titleStyles}>Номер картки:</p>}
              {bd.bank_code && <p className={titleStyles}>МФО:</p>}
              {bd.tax_id && <p className={titleStyles}>ЄДРПОУ/ІНН:</p>}
              {bd.iban && <p className={titleStyles}>IBAN:</p>}
            </div>
            <div className="flex flex-col gap-1 justify-center ">
              {bd.bank_name && <p className={valueStyles}>{bd.bank_name}</p>}
              {bd.card_number && (
                <div className="flex items-center gap-2">
                  <p className={valueStyles}>{bd.card_number}</p>
                  <Button
                    variant="ghost"
                    onClick={() => handleCopy(bd.card_number!)}
                    className="h-5 has-[>svg]:p-0"
                  >
                    {copied === bd.card_number ? (
                      <CheckCheck className="text-brand-default" />
                    ) : (
                      <Copy />
                    )}
                  </Button>
                </div>
              )}
              {bd.bank_code && <p className={valueStyles}>{bd.bank_code}</p>}
              {bd.tax_id && <p className={valueStyles}>{bd.tax_id}</p>}
              {bd.iban && (
                <div className="flex items-center gap-2">
                  <p className={valueStyles}>{bd.iban}</p>

                  <Button
                    variant="ghost"
                    onClick={() => handleCopy(bd.iban!)}
                    className="h-5 has-[>svg]:p-0"
                  >
                    {copied === bd.iban ? (
                      <CheckCheck className="text-brand-default" />
                    ) : (
                      <Copy />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonBankDetails;
