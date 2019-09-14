Vue.component('convert-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">GBG conversion</label>
		<div class="container">
			<div class="field">
				<label class="label">Conversion request owner</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.owner" @change="update('owner', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<label class="label">Amount</label>
			<div class="field has-addons">
				<p class="control has-icons-left is-expanded">
				<input class="input" type="number" v-model.lazy="amount" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
				<div class="control">
				<div class="select">
					<select disabled>
						<option>GBG</option>
					</select>
				</div>
				</div>
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
		amount: {
			get: function() {
				return parseFloat(this.value.amount.split(' ')[0]);
			},
			set: function(amount) {
				amount = Number.parseFloat(amount);
				if (isNaN(amount))
					amount = 0;
				amount = amount.toFixed(3) + ' GBG';
				this.update('amount', amount);
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

