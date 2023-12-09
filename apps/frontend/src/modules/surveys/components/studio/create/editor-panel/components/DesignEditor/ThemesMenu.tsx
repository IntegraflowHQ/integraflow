import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const ThemesMenu = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="hover:cursor-pointer">
          <MoreHorizontal size={25} color="#AFAAC7" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="-mt-2 mr-16 rounded-md border border-intg-bg-10 bg-intg-bg-9 px-3 py-3">
          <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-2 text-sm font-light text-intg-text-4 transition-all ease-in-out hover:bg-intg-bg-13">
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-2 text-sm font-light text-intg-text-4 transition-all ease-in-out hover:bg-intg-bg-13">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
