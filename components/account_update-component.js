Vue.component('account_update-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Update account</label>
		<div class="container">
			<div class="field">
				<label class="label">Account</label>
				<div class="control is-expanded has-icons-left">
				<input class="input" type="text" :value="value.account" @change="update('account', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</div>
			</div>
			<div v-if="value.master_authority" class="has-background-link notification">
				<button v-if="editable" @click="removeSection('master_authority')" class="button" style="position: absolute;right: 0.5rem;top: 0.5rem;">
					<span class="icon is-small">
						<i class="fa fa-times"></i>
					</span>
				</button>
				<label class="label">master_authority authorities</label>
				<div class="field has-addons">
					<div class="control is-expanded">
					<input class="input" type="text" value="Weight theshold" disabled>
					</div>
					<div class="control">
					<input class="input" type="number" :value="value.master_authority.weight_threshold" @change="updateTreshold('master_authority', $event.target.value.trim())" :disabled="editable == false">
					</div>
				</div>
				<div v-for="(item, index) in value.master_authority.account_auths" class="field has-addons">
					<div class="control is-expanded has-icons-left">
					<input class="input" type="text" :value="item[0]" @change="updateSection('master_authority', index, $event.target.value.trim(), undefined)" :disabled="editable == false">
					<span class="icon is-small is-left">
						<i class="fas fa-user-circle"></i>
					</span>
					</div>
					<div class="control">
					<input class="input" type="number" :value="item[1]" @change="updateSection('master_authority', index, undefined, $event.target.value.trim())" :disabled="editable == false">
					</div>
					<div v-if="editable" class="control">
						<button class="button is-error" @click="removeAuthority('master_authority', index)">
							<span class="icon is-small">
								<i class="fas fa-times"></i>
							</span>
						</button>
					</div>
				</div>
				<div v-if="editable">
					<button class="button is-primary is-fullwidth" @click="addAuthority('master_authority')">Add another signatory</button>
				</div>
			</div>
			<div v-else-if="editable">
				<button class="button is-primary is-fullwidth" @click="addSeciton('master_authority')">Change master_authority authority</button>
			</div>

			<div v-if="value.active" class="has-background-link notification">
				<button v-if="editable" @click="removeSection('active')" class="button" style="position: absolute;right: 0.5rem;top: 0.5rem;">
					<span class="icon is-small">
						<i class="fa fa-times"></i>
					</span>
				</button>
				<label class="label">Active authorities</label>
				<div class="field has-addons">
					<div class="control is-expanded">
					<input class="input" type="text" value="Weight theshold" disabled>
					</div>
					<div class="control">
					<input class="input" type="number" :value="value.active.weight_threshold" @change="updateTreshold('active', $event.target.value.trim())" :disabled="editable == false">
					</div>
				</div>
				<div v-for="(item, index) in value.active.account_auths" class="field has-addons">
					<div class="control is-expanded has-icons-left">
					<input class="input" type="text" :value="item[0]" @change="updateSection('active', index, $event.target.value.trim(), undefined)" :disabled="editable == false">
					<span class="icon is-small is-left">
						<i class="fas fa-user-circle"></i>
					</span>
					</div>
					<div class="control">
					<input class="input" type="number" :value="item[1]" @change="updateSection('active', index, undefined, $event.target.value.trim())" :disabled="editable == false">
					</div>
					<div v-if="editable" class="control">
						<button class="button is-error" @click="removeAuthority('active', index)">
							<span class="icon is-small">
								<i class="fas fa-times"></i>
							</span>
						</button>
					</div>
				</div>
				<div v-if="editable">
					<button class="button is-primary is-fullwidth" @click="addAuthority('active')">Add another signatory</button>
				</div>
			</div>
			<div v-else-if="editable">
				<button class="button is-primary is-fullwidth" @click="addSeciton('active')">Change active authority</button>
			</div>

			<div v-if="value.regular_authority" class="has-background-link notification">
				<button v-if="editable" @click="removeSection('regular_authority')" class="button" style="position: absolute;right: 0.5rem;top: 0.5rem;">
					<span class="icon is-small">
						<i class="fa fa-times"></i>
					</span>
				</button>
				<label class="label">Regular authorities</label>
				<div class="field has-addons">
					<div class="control is-expanded">
					<input class="input" type="text" value="Weight theshold" disabled>
					</div>
					<div class="control">
					<input class="input" type="number" :value="value.regular_authority.weight_threshold" @change="updateTreshold('regular_authority', $event.target.value.trim())" :disabled="editable == false">
					</div>
				</div>
				<div v-for="(item, index) in value.regular_authority.account_auths" class="field has-addons">
					<div class="control is-expanded has-icons-left">
					<input class="input" type="text" :value="item[0]" @change="updateSection('regular_authority', index, $event.target.value.trim(), undefined)" :disabled="editable == false">
					<span class="icon is-small is-left">
						<i class="fas fa-user-circle"></i>
					</span>
					</div>
					<div class="control">
					<input class="input" type="number" :value="item[1]" @change="updateSection('regular_authority', index, undefined, $event.target.value.trim())" :disabled="editable == false">
					</div>
					<div v-if="editable" class="control">
						<button class="button is-error" @click="removeAuthority('regular_authority', index)">
							<span class="icon is-small">
								<i class="fas fa-times"></i>
							</span>
						</button>
					</div>
				</div>
				<div v-if="editable">
					<button class="button is-primary is-fullwidth" @click="addAuthority('regular_authority')">Add another signatory</button>
				</div>
			</div>
			<div v-else-if="editable">
				<button class="button is-primary is-fullwidth" @click="addSeciton('regular_authority')">Change regular authority</button>
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
			authorities: {
				master_authority: {weight_threshold: 1, account_auths: [], key_auths: []},
				active: {weight_threshold: 1, account_auths: [], key_auths: []},
				regular authority: {weight_threshold: 1, account_auths: [], key_auths: []},
			}
		}
	},
	methods: {
		loadAuthorities() {
			var self = this;
			if (this.value.account) {
				viz.api.getAccounts([this.value.account], function(err, res) {
					if (res.length == 1) {
						self.authorities.master_authority = res[0].master_authority;
						self.authorities.active_authority = res[0].active_authority;
						self.authorities.regular_authority = res[0].regular_authority;
					}
				});
			}
		},
		addSeciton(type) {
			var copy = cloneDeep(this.value);
			copy[type] = cloneDeep(this.authorities[type]);
			console.log(copy[type])
			this.$emit('input', copy);
		},
		removeSection(type) {
			var copy = cloneDeep(this.value);
			delete copy[type];
			this.$emit('input', copy);
		},
		updateSection(type, index, account, weight) {
			var copy = cloneDeep(this.value);
			if (account)
				copy[type].account_auths[index][0] = account;
			if (weight) {
				weight = parseFloat(weight);
				if (weight <= 1 || isNaN(weight))
					weight = 1;
				else
					weight = Math.ceil(weight);
				copy[type].account_auths[index][1] = weight;
			}
			if (account || weight)
				this.$emit('input', copy);
		},
		updateTreshold(type, treshold) {
			var copy = cloneDeep(this.value);
			treshold = parseFloat(treshold);
			if (treshold <= 1 || isNaN(treshold))
				treshold = 1;
			else
				treshold = Math.ceil(treshold);
			copy[type].weight_threshold = treshold;
			this.$emit('input', copy);
		},
		addAuthority(type) {
			var copy = cloneDeep(this.value);
			copy[type].account_auths.push(['', 1]);
			this.$emit('input', copy);
		},
		removeAuthority(type, index) {
			var copy = cloneDeep(this.value);
			copy[type].account_auths.splice(index, 1);
			this.$emit('input', copy);
		},
		suicide() {
			this.$emit('delete-operation');
		},
		update(key, value) {
			this.$emit('input', { ...this.value, [key]: value })
		},
	},
	watch: {
		'value.account': function() {
			this.loadAuthorities();
		},
	},
	mounted: function() {
		this.loadAuthorities();
	},
})

