Vue.component('modal-info-component', {
	template: `
	<div :class="['modal', {'is-active': active}]">
		<div class="modal-background"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">{{ title }}</p>
				<button class="delete" aria-label="close" @click="emitEvent('close')"></button>
			</header>
			<section class="modal-card-body">
			<slot></slot>
			</section>
			<footer class="modal-card-foot">
				<button class="button" @click="emitEvent('close')">Close</button>
			</footer>
		</div>
	</div>
	`,
	props: {
		title: String,
		active: Boolean,
	},
	methods: {
		emitEvent(name) {
			this.$emit(name);
		},
	},
})

