import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Form } from "@components/common/DivName";
import { memo } from "react";
import { useState, useEffect } from "react";

type DropdownProps = {
  title: string;
  value?: number | null;
  onSelect?: (diseaseId: number) => void;
};

const diseaseData: { [key: number]: string } = {
  1: "유전 및 희귀 질환",
  2: "치매",
  3: "정신건강",
  4: "대사 및 내분비",
  5: "심혈관",
  6: "근골격계",
  7: "암",
  8: "피부 및 자가면역",
  9: "소아청소년",
  10: "기타",
};

function DiseaseDrop({ title, value = null, onSelect }: DropdownProps) {
  const [selectedText, setSelectedText] = useState<string>("");
  // const selectedText = value !== null ? diseaseData[value] : "";

  useEffect(() => {
    if (value !== null && diseaseData[value]) {
      setSelectedText(diseaseData[value]);
    } else {
      setSelectedText("");
    }
  }, [value]);

  return (
    <Menu as="div" className="relative inline-block text-left w-full font-suite">
      <Form className="gap-3 w-full">
        <div className="block text-xl font-bold text-cardTitle">{title}</div>
        <MenuButton className="flex justify-between w-full rounded-xl bg-white px-4 py-3 text-lg font-bold text-cardLongContent outline-none border-2 focus:border-yellow100 focus:border-1 focus:ring-0.5 focus:ring-yellow100">
          {selectedText || "대화 주제를 선택해주세요"}
          <ChevronDownIcon aria-hidden="true" className="mr-1 size-7 text-gray-400" />
        </MenuButton>
      </Form>

      <MenuItems className="absolute left-0 z-50 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1 max-h-40 overflow-y-auto">
          {Object.entries(diseaseData).map(([id, disease]) => (
            <MenuItem key={id}>
              <button
                type="button"
                className={"text-gray-700 block w-full px-4 py-3 text-left text-sm"}
                onClick={() => onSelect?.(Number(id))}
              >
                {disease}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}

export default memo(DiseaseDrop);
