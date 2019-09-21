Vue.component('withdraw_vesting-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Delegate GOLOS Power</label>
		<div class="container">
			<div class="field">
				<label class="label">Account</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.account" @change="update('account', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<label class="label">Amount (in GOLOS)</label>
			<div class="field has-addons">
				<div class="control is-expanded has-icons-left">
				<input class="input" type="number" v-model.lazy="amount" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-coins"></i>
				</span>
				</div>
				<div class="control">
					<div class="select">
						<select disabled>
							<option>GOLOS Power</option>
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
	data: function() {
		return {
			total_vesting_fund_shares: '',
			total_vesting_fund_steem: '',
		};
	},
	computed: {
		vests_per_steem: function() {
			return parseFloat(this.total_vesting_fund_shares.split(' ')[0]) /
				parseFloat(this.total_vesting_fund_steem.split(' ')[0]);
		},
		amount: {
			get: function() {
				return (Number.parseFloat(this.value.vesting_shares.split(' ')[0]) / this.vests_per_steem).toFixed(3);
			},
			set: function(newValue) {
				newValue = Number.parseFloat(newValue);
				newValue = newValue * this.vests_per_steem;
				this.update('vesting_shares', newValue.toFixed(6) + ' GESTS');
			},
		},
	},
	mounted: function() {
		var self = this;
		golos.api.getDynamicGlobalProperties(function(err, result) {
			if (!err) {
				self.total_vesting_fund_shares = result.total_vesting_shares;
				self.total_vesting_fund_steem = result.total_vesting_fund_steem;
			}
		});
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

