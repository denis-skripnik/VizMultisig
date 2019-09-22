Vue.component('dashboard-proposal-component', {
	template: `
	<a @click="emitEvent('click')" >
		<div class="tile is-parent">
			<div :class="['tile', 'is-child', 'notification', 'has-text-black', {'has-background-primary': isPrimary, 'has-background-warning': isWarning}]">
				<p class="title">{{ proposal.title }}</p>
				<p class="subtitle">{{ '@' + proposal.author }}</p>
				<p class="content">{{ proposal.memo }}</p>
				<div class="content tags">
					<span v-for="item in signatories" :class="['tag', 'has-text-weight-bold', 'is-medium', requiredSignatories.includes(item) ? 'is-danger' : 'is-success']">
						@{{ item }}
					</span>
				</div>
			</div>
		</div>
	</a>
	`,
	props: ['proposal', 'signatory'],
	computed: {
		requiredSignatories: function() {
			var self = this;
			let owner = this.proposal.required_owner_approvals.filter(function(item){return !self.proposal.available_owner_approvals.includes(item)});
			let active = this.proposal.required_active_approvals.filter(function(item){
				return !self.proposal.available_owner_approvals.includes(item) &&
						!self.proposal.available_active_approvals.includes(item);
			});
			let posting = this.proposal.required_posting_approvals.filter(function(item){
				return !self.proposal.available_owner_approvals.includes(item) &&
						!self.proposal.available_active_approvals.includes(item) &&
						!self.proposal.available_posting_approvals.includes(item);
			});
			return this.mergeArrays(owner, this.mergeArrays(active, posting));
		},
		signatories: function() {
			let owner = this.mergeArrays(this.proposal.required_owner_approvals, this.proposal.available_owner_approvals);
			let active = this.mergeArrays(this.proposal.required_active_approvals, this.proposal.available_active_approvals);
			let posting = this.mergeArrays(this.proposal.required_posting_approvals, this.proposal.available_posting_approvals);
			return this.mergeArrays(owner, this.mergeArrays(active, posting));
		},
		isWarning: function() {
			var req_owner = this.proposal.required_owner_approvals.includes(this.signatory) &&
							!this.proposal.available_owner_approvals.includes(this.signatory);
			
			var req_active = this.proposal.required_active_approvals.includes(this.signatory) &&
							!this.proposal.available_owner_approvals.includes(this.signatory) &&
							!this.proposal.available_active_approvals.includes(this.signatory);
			
			var req_posting = this.proposal.required_posting_approvals.includes(this.signatory) &&
							!this.proposal.available_owner_approvals.includes(this.signatory) &&
							!this.proposal.available_active_approvals.includes(this.signatory) &&
							!this.proposal.available_posting_approvals.includes(this.signatory)
			return req_owner || req_active || req_posting;
		},
		isPrimary: function() {
			return !this.isWarning;
		},
	},
	methods: {
		mergeArrays(a, b) {
			return a.concat(b.filter(function (item) {
				return a.indexOf(item) < 0;
			}));
		},
		emitEvent(name) {
			this.$emit(name);
		},
	},
});
