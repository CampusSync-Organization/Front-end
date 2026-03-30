return {
	"nvim-neo-tree/neo-tree.nvim",
	opts = {
		window = {
			position = "right", -- Moves the explorer to the right side
			width = 30, -- Adjust this to your preferred width
		},
		default_component_configs = {
			indent = {
				with_expanders = true, -- Adds arrows for expanding/collapsing
				expander_collapsed = "",
				expander_expanded = "",
			},
			icon = {
				folder_closed = "",
				folder_open = "",
				folder_empty = "󰜌",
				-- This ensures icons look clean
				default = "󰈚",
				highlight = "NeoTreeFileIcon",
			},
		},
	},
}
