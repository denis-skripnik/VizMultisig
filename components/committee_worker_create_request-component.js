Vue.component('committee_worker_create_request-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Committee worker create request</label>
		<div class="container">
			<div class="field">
				<label class="label">Url</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.url" @change="update('url', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-link-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<label class="label">Worker</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.worker" @change="update('worker', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<label class="label">required_amount_min</label>
			<div class="field has-addons">
				<div class="control is-expanded has-icons-left">
				<input class="input" type="number" v-model.lazy="required_amount_min" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-coins"></i>
				</span>
				</div>
					<input type="hidden" v-model="currency" :disabled="editable == false" value="VIZ">
			</div>
			<label class="label">required_amount_max</label>
			<div class="field has-addons">
				<div class="control is-expanded has-icons-left">
				<input class="input" type="number" v-model.lazy="required_amount_max" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-coins"></i>
				</span>
				</div>
					<input type="hidden" v-model="currency" :disabled="editable == false" value="VIZ">
			</div>
			<div class="field">
			<label class="label">duration</label>
			<p class="control has-icons-left has-icons-right">
			<input class="input" type="number" :value="value.duration" @input="update('duration', isNaN(parseInt($event.target.value)) ? 432000 : Math.min(Math.max(parseInt($event.target.value), 432000), 2592000))" :disabled="!editable">
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
	computed: {
		required_amount_min: {
			get: function() {
				return this.value.required_amount_min.split(' ')[0];
			},
			set: function(newValue) {
				newValue = Number.parseFloat(newValue);
				if (isNaN(newValue))
					newValue = 0;
				newValue = newValue.toFixed(3);
				var newAmount = newValue + ' VIZ';
				this.update('required_amount_min', newAmount);
			},
		},
		required_amount_max: {
			get: function() {
				return this.value.required_amount_max.split(' ')[0];
			},
			set: function(newValue) {
				newValue = Number.parseFloat(newValue);
				if (isNaN(newValue))
					newValue = 0;
				newValue = newValue.toFixed(3);
				var newAmount = newValue + ' VIZ';
				this.update('required_amount_max', newAmount);
			},
		},
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

