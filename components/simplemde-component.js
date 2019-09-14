Vue.component('simplemde', {
	props: {'value': String, disabled: Boolean},
	template: `
	<textarea ref="area" :disabled="disabled"></textarea>
	`,
	mounted() {
		var settings = {
			element: this.$refs.area, // Tie SimpleMDE to your textarea
			autofocus: false,
			autosave: false,
			blockStyles: {
				bold: "**",
				italic: "*",
				strikethrough:"~"
			},
			spellChecker: false,
			indentWithTabs: true,
			insertTexts: {
				horizontalRule: ["", "\n\n-----\n\n"],
				image: ["![](https://", ")"],
				link: ["[", "](https://)"],
				table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
			},
			parsingConfig: {
				allowAtxHeaderWithoutSpace: true,
				strikethrough: false,
				underscoresBreakWords: true,
			},
			placeholder: "Post content",
			promptURLs: true,
			renderingConfig: {
				singleLineBreaks: true,
				codeSyntaxHighlighting: true,
			},
			styleSelectedText: true,
			tabSize: 4,
			toolbarTips: true,
			// Set your SimpleMDE configuration here
			// e.g. remove the status bar (status: false), customise the
			// toolbar (toolbar: ["bold", "italic", "heading"]) or similar
		};
		if (this.disabled)
			settings.toolbar = false;
		this.mde = new SimpleMDE(settings);
		this.mde.value(this.value)
		if (this.disabled)
			this.mde.togglePreview();
		var self = this
		this.mde.codemirror.on('change', function() {
			// Catch on change events
			self.$emit('input', self.mde.value())
		})
	},
	watch: {
		// Setup a watch to track changes,
		// and only update when changes are made
		value(newVal) {
			if (newVal != this.mde.value()) {
				this.mde.value(newVal)
			}
		}
	},
	beforeDestroy() {
		// Clean up when the component gets destroyed
		this.mde.toTextArea()
	}
})
