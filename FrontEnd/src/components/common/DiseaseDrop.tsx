import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Form } from "@components/common/DivName";

type DropdownProps = {
  title: string;
};

const diseaseData: string[] = [
  "유전 및 희귀 질환",
  "치매",
  "정신건강",
  "대사 및 내분비",
  "심혈관",
  "근골격계",
  "암",
  "피부 및 자가면역",
  "소아청소년",
  "기타",
];

function DiseaseDrop({ title }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <Form className="gap-3 w-full">
        <div className="block text-xl font-bold text-cardTitle">{title}</div>
        <div>
          <MenuButton className="inline-flex w-full justify-start gap-x-2 rounded-xl bg-white px-4 py-4 text-lg font-bold text-gray-400 outline-none border-2 focus:border-yellow100 focus:border-yellow100  focus:ring-0.5 focus:ring-yellow100">
            대화를 나누고 싶은 주제를 선택하세요
            <ChevronDownIcon aria-hidden="true" className="mr-1 size-7 text-gray-400" />
          </MenuButton>
        </div>
      </Form>

      {/* dropdown 영역 */}
      <MenuItems
        transition
        className="relative left-0 z-50 mt-2 w-full origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <div className="py-1 overflow-y-scroll">
          {diseaseData.map((disease, index) => (
            <MenuItem key={index}>
              <span className="block px-4 py-3 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                {disease}
              </span>
            </MenuItem>
          ))}
          {/* <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              치매
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              License
            </a>
          </MenuItem> */}
          <form action="#" method="POST">
            <MenuItem>
              <button
                type="submit"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
              >
                Sign out
              </button>
            </MenuItem>
          </form>
        </div>
      </MenuItems>
    </Menu>
  );
}

export default DiseaseDrop;
