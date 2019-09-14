Vue.component('account_witness_vote-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Witness vote</label>
		<div class="container">
			<div class="field">
				<label class="label">Voter</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.account" @change="update('account', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<label class="label">Witness</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.witness" @change="update('witness', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<div class="control">
				<div class="select">
					<select v-model="vote" :disabled="editable == false">
						<option>Vote</option>
						<option>Unvote</option>
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
			vote: ((this.value.approve == true) ? 'Vote' : 'Unvote'),
		}
	},
	computed: {
	},
	watch: {
		vote: function(newVal) {
			this.update('approve', ((newVal== 'Vote') ? true : false));
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

