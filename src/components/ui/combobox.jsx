"use client";
import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function Combobox({ items = [], onSearch, value, onChange, placeholder = "Select item..." }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? items.find((item) => item.id === value)?.name
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            onChange={(e) => onSearch(e.target.value)}
          />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => {
                  onChange(item.id === value ? "" : item.id);
                  setOpen(false);
                }}
              >
                {item.name}
                <CheckIcon
                  className={item.id === value ? "ml-auto h-4 w-4 opacity-100" : "ml-auto h-4 w-4 opacity-0"}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
