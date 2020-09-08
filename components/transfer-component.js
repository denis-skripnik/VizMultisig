Vue.component('transfer-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Transfer</label>
		<div class="container">
			<div class="field">
				<label class="label">From</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.from" @change="update('from', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<label class="label">To</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.to" @change="update('to', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<label class="label">Amount</label>
			<div class="field has-addons">
				<div class="control is-expanded has-icons-left">
				<input class="input" type="number" v-model.lazy="amount" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-coins"></i>
				</span>
				</div>
					<input type="hidden" v-model="currency" :disabled="editable == false" value="VIZ">
			</div>
			<div class="field">
				<label class="label">Memo</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.memo" @change="update('memo', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-clipboard"></i>
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
	data: function() {
		return {
			currency: this.value.amount.split(' ')[1],
		}
	},
	computed: {
		amount: {
			get: function() {
				return this.value.amount.split(' ')[0];
			},
			set: function(newValue) {
				newValue = Number.parseFloat(newValue);
				if (isNaN(newValue))
					newValue = 0;
				newValue = newValue.toFixed(3);
				var newAmount = newValue + ' ' + this.currency;
				this.update('amount', newAmount);
			},
		},
	},
	watch: {
		currency: function(newVal) {
			var newAmount = this.amount + ' ' + newVal;
			this.update('amount', newAmount);
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

