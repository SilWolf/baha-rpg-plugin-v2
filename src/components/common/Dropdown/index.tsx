import { Menu, Transition } from '@headlessui/react'
import React, { HTMLAttributes } from 'react'
import { AnchorHTMLAttributes } from 'react'

type DropdownItem = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
> & {
  icon?: React.ReactNode
  label: React.ReactNode
}

type Props = HTMLAttributes<HTMLButtonElement> & {
  itemGroups: DropdownItem[][]
  trigger: React.ReactNode
}

const Dropdown = ({ trigger, itemGroups, ...buttonProps }: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button {...buttonProps}>{trigger}</Menu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
          {itemGroups.map((itemGroup, i) => (
            <div key={i} className="px-1 py-1">
              {itemGroup.map(({ icon, label, ...aProps }, j) => (
                <Menu.Item key={j}>
                  <a
                    {...aProps}
                    className="min-w-[96px] p-1 cursor-pointer flex gap-x-1 items-center hover:bg-teal-500 hover:text-white rounded"
                  >
                    <div className="h-5 w-5">{icon}</div>
                    <div className="flex-1">{label}</div>
                  </a>
                </Menu.Item>
              ))}
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Dropdown
