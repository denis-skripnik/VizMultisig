Vue.component('pageloader-component', {
	template: `
	<div :class="['pageloader', {'is-active': active == true}]">
		<span class="title">
			{{ title }}
		</span>
	</div>
	`,
	props: {
		title: String,
		active: Boolean,
	},
})

