import { RemoteUser } from "@/types/user"
import { StateField } from "@codemirror/state"
import { EditorView, showTooltip } from "@codemirror/view"

export function tooltipField(users: RemoteUser[]) {
  return StateField.define({
    create: () => getCursorTooltips(users),
    update(tooltips, tr) {
      if (!tr.docChanged && !tr.selection) return tooltips
      return getCursorTooltips(users)
    },
    provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
  })
}

export function getCursorTooltips(users: RemoteUser[]) {
  return users
    .filter((user) => user.typing)
    .map((user) => {
      const text = user.username
      const pos = user.cursorPosition
      return {
        pos,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          const dom = document.createElement("div")
          dom.className = "cm-tooltip-cursor"
          dom.textContent = text
          return { dom }
        },
      }
    })
}

// 🎨 DevJAM tooltip styling
export const cursorTooltipBaseTheme = EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-cursor": {
    backgroundColor: "#3d2a57",         // DevJAM accent
    color: "#ffffff",                   // White text
    border: "1px solid #7C3AED",        // DevJAM primary border
    padding: "3px 8px",
    fontSize: "0.875rem",
    fontFamily: "'Space Grotesk', sans-serif",
    borderRadius: "6px",
    zIndex: "10",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    "& .cm-tooltip-arrow:before": {
      borderTopColor: "#3d2a57",        // Tooltip arrow
    },
    "& .cm-tooltip-arrow:after": {
      borderTopColor: "transparent",
    },
  },
})
