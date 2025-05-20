"use client";

import { ReactNode, SetStateAction } from "react";
import Link from "next/link";
import { EyeIcon, FilePenIcon, MoreHorizontalIcon, Trash2 } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

interface ActionsMenuProps {
  label?: string;
  editItemLink?: string;
  viewItemTitle?: string;
  viewItemDialogOpen?: (value: SetStateAction<boolean>) => void;
  editItemTitle?: string;
  deleteItemDialogOpen?: (value: SetStateAction<boolean>) => void;
  deleteItemTitle?: string;
  extraItems?: ReactNode;
}

const ActionsMenu = ({
  label,
  editItemLink,
  viewItemTitle,
  viewItemDialogOpen,
  editItemTitle,
  deleteItemDialogOpen,
  deleteItemTitle,
  extraItems,
}: ActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {label && (
          <>
            <DropdownMenuLabel className="ml-2">{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {viewItemDialogOpen && (
          <DropdownMenuItem onClick={() => viewItemDialogOpen(true)}>
            <EyeIcon /> {viewItemTitle}
          </DropdownMenuItem>
        )}
        {editItemLink && (
          <DropdownMenuItem asChild>
            <Link href={editItemLink}>
              <FilePenIcon className="size-4" /> {editItemTitle}
            </Link>
          </DropdownMenuItem>
        )}
        {extraItems && extraItems}
        {deleteItemTitle && deleteItemDialogOpen && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteItemDialogOpen(true)}
              className="text-action-alert focus:text-action-alert focus:bg-accent-pink"
            >
              <Trash2 className="text-action-alert size-4" />
              {deleteItemTitle}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsMenu;
