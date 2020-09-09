Vue.component('committee_worker_cancel_request-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Committee worker cancel request</label>
		<div class="container">
			<div class="field">
			<label class="label">request_id</label>
			<p class="control has-icons-left has-icons-right">
			<input class="input" type="number" :value="value.request_id" @input="update('request_id', isNaN(parseInt($event.target.value)) ? 1 : Math.min(Math.max(parseInt($event.target.value), 1), 1000000000000))" :disabled="!editable">
			<span class="icon is-small is-left">
				<i class="fas fa-chevron-circle-up"></i>
			</span>
			</p>
		</div>
			</div>
		<button v-if="editable" class="delete" @click="suicide()">
		</button>
	</div>
</div>
	`,
	props: {
		value: Object,
		editable: Boolean,
	},
	methods: {
		suicide() {
			this.$emit('delete-operation');
		},
		update(key, value) {
			this.$emit('input', { ...this.value, [key]: value })
		},
	},
})

