Vue.component('limit_order_create-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Transfer</label>
		<div class="container">
			<div class="field">
				<label class="label">Order owner</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.owner" @change="update('owner', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<div class="control">
				<div class="select">
					<select v-model="type" :disabled="editable == false">
						<option>Buy</option>
						<option>Sell</option>
					</select>
				</div>
				</div>
			</div>
			<label class="label">Amount</label>
			<div class="field has-addons">
				<div class="control has-icons-left is-expanded">
				<input class="input" type="number" v-model.lazy="amount" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</div>
				<div class="control">
				<div class="select">
					<select disabled>
						<option>GBG</option>
					</select>
				</div>
				</div>
			</div>
			<div class="field">
				<label class="label">Price (Golos/GBG)</label>
				<div class="control is-expanded has-icons-left">
				<input class="input" type="number" v-model.lazy="price" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-coins"></i>
				</span>
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
	data: function() {
		return {
			type: ((this.value.amount_to_sell.split(' ')[1] == 'GBG') ? 'Sell' : 'Buy'),
		}
	},
	computed: {
		amount: {
			get: function() {
				if (this.type == 'Buy')
					return parseFloat(this.value.min_to_receive.split(' ')[0]).toFixed(3);
				else
					return parseFloat(this.value.amount_to_sell.split(' ')[0]).toFixed(3);
			},
			set: function(newValue) {
				newValue = Number.parseFloat(newValue);
				if (isNaN(newValue) || newValue == 0)
					newValue = 0.001;
				newValue = newValue.toFixed(3);
				var newAmount = newValue + ' GBG';
				if (this.type == 'Buy')
					this.updateAmounts(newAmount, this.price);
				else
					this.updateAmounts(newAmount, this.price);
			},
		},
		price: {
			get: function() {
				var toSell = parseFloat(this.value.amount_to_sell.split(' ')[0]);
				var toRecieve = parseFloat(this.value.min_to_receive.split(' ')[0]);
				var price = toSell / toRecieve;
				if (this.type == 'Sell')
					price = 1.0 / price;
				return price.toFixed(3);
			},
			set: function(price) {
				if (price == 0 || isNaN(price))
					price = 1;
				if (this.type == 'Buy') {
					this.updateAmounts(this.value.min_to_receive, price);
				} else {
					this.updateAmounts(this.value.amount_to_sell, price);
				}
			},
		},
	},
	watch: {
		type: function() {
			this.$emit('input', { ...this.value, ['amount_to_sell']: this.value.min_to_receive, ['min_to_receive']: this.value.amount_to_sell })
		},
	},
	methods: {
		updateAmounts(gbgAmount, price) {
			var amount = parseFloat(gbgAmount.split(' ')[0]);
			var golosAmount = (amount * price).toFixed(3) + ' GOLOS';
			if (this.type == 'Buy')
				this.$emit('input', { ...this.value, ['amount_to_sell']: golosAmount, ['min_to_receive']: gbgAmount });
			else
				this.$emit('input', { ...this.value, ['amount_to_sell']: gbgAmount, ['min_to_receive']: golosAmount });
		},
		suicide() {
			this.$emit('delete-operation');
		},
		update(key, value) {
			this.$emit('input', { ...this.value, [key]: value })
		},
	},
})

