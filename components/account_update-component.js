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
			<div v-if="value.owner" class="has-background-link notification">
				<button v-if="editable" @click="removeSection('owner')" class="button" style="position: absolute;right: 0.5rem;top: 0.5rem;">
					<span class="icon is-small">
						<i class="fa fa-times"></i>
					</span>
				</button>
				<label class="label">Owner authorities</label>
				<div class="field has-addons">
					<div class="control is-expanded">
					<input class="input" type="text" value="Weight theshold" disabled>
					</div>
					<div class="control">
					<input class="input" type="number" :value="value.owner.weight_threshold" @change="updateTreshold('owner', $event.target.value.trim())" :disabled="editable == false">
					</div>
				</div>
				<div v-for="(item, index) in value.owner.account_auths" class="field has-addons">
					<div class="control is-expanded has-icons-left">
					<input class="input" type="text" :value="item[0]" @change="updateSection('owner', index, $event.target.value.trim(), undefined)" :disabled="editable == false">
					<span class="icon is-small is-left">
						<i class="fas fa-user-circle"></i>
					</span>
					</div>
					<div class="control">
					<input class="input" type="number" :value="item[1]" @change="updateSection('owner', index, undefined, $event.target.value.trim())" :disabled="editable == false">
					</div>
					<div v-if="editable" class="control">
						<button class="button is-error" @click="removeAuthority('owner', index)">
							<span class="icon is-small">
								<i class="fas fa-times"></i>
							</span>
						</button>
					</div>
				</div>
				<div v-if="editable">
					<button class="button is-primary is-fullwidth" @click="addAuthority('owner')">Add another signatory</button>
				</div>
			</div>
			<div v-else-if="editable">
				<button class="button is-primary is-fullwidth" @click="addSeciton('owner')">Change owner authority</button>
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

			<div v-if="value.posting" class="has-background-link notification">
				<button v-if="editable" @click="removeSection('posting')" class="button" style="position: absolute;right: 0.5rem;top: 0.5rem;">
					<span class="icon is-small">
						<i class="fa fa-times"></i>
					</span>
				</button>
				<label class="label">Posting authorities</label>
				<div class="field has-addons">
					<div class="control is-expanded">
					<input class="input" type="text" value="Weight theshold" disabled>
					</div>
					<div class="control">
					<input class="input" type="number" :value="value.posting.weight_threshold" @change="updateTreshold('posting', $event.target.value.trim())" :disabled="editable == false">
					</div>
				</div>
				<div v-for="(item, index) in value.posting.account_auths" class="field has-addons">
					<div class="control is-expanded has-icons-left">
					<input class="input" type="text" :value="item[0]" @change="updateSection('posting', index, $event.target.value.trim(), undefined)" :disabled="editable == false">
					<span class="icon is-small is-left">
						<i class="fas fa-user-circle"></i>
					</span>
					</div>
					<div class="control">
					<input class="input" type="number" :value="item[1]" @change="updateSection('posting', index, undefined, $event.target.value.trim())" :disabled="editable == false">
					</div>
					<div v-if="editable" class="control">
						<button class="button is-error" @click="removeAuthority('posting', index)">
							<span class="icon is-small">
								<i class="fas fa-times"></i>
							</span>
						</button>
					</div>
				</div>
				<div v-if="editable">
					<button class="button is-primary is-fullwidth" @click="addAuthority('posting')">Add another signatory</button>
				</div>
			</div>
			<div v-else-if="editable">
				<button class="button is-primary is-fullwidth" @click="addSeciton('posting')">Change posting authority</button>
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
				owner: {weight_threshold: 1, account_auths: [], key_auths: []},
				active: {weight_threshold: 1, account_auths: [], key_auths: []},
				posting: {weight_threshold: 1, account_auths: [], key_auths: []},
			}
		}
	},
	methods: {
		loadAuthorities() {
			var self = this;
			if (this.value.account) {
				viz.api.getAccounts([this.value.account], function(err, res) {
					if (res.length == 1) {
						self.authorities.owner = res[0].owner;
						self.authorities.active = res[0].active;
						self.authorities.posting = res[0].posting;
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

