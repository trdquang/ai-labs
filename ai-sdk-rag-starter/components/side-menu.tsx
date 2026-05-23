"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const menuItems = [
  { href: "/", label: "Home" },

  { href: "/chat-context", label: "Chat Context" },
  { href: "/chat-pdf", label: "Chat PDF" },
  { href: "/chatgpt", label: "ChatGPT" },
  { href: "/call-tools", label: "Call Tools" },
  { href: "/generate-text", label: "Generate Text" },
  { href: "/generate-text-chat-prompt", label: "Generate Text (Chat)" },
  { href: "/generate-object", label: "Generate Object" },
  { href: "/generate-object-file-prompt", label: "Generate Object (File)" },
  { href: "/stream-object", label: "Stream Object" },
  { href: "/stream-text-image", label: "Stream Text & Image" },
  { href: "/human-in-the-loop", label: "Human in the Loop" },
  { href: "/render-visual-interface-in-chat", label: "Visual Interface" },
  { href: "/send-custom-body-from-use-chat", label: "Custom Body" },
];

export function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          AI SDK Examples
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
