var searchParams = new URLSearchParams(window.location.search);

var GET_params = {};

for(var pair of searchParams) {
   GET_params[pair[0]] = pair[1]; 
}

var app = new Vue({
	el: '#app',
	data: {
		settings: {
			collapsed: false,
			node: '',
			account: '',
			signatory: '',
			signatoryKey: '',
		},
		state: {
			getParams: GET_params,
			page: 'main', // ['main', 'dashboard', 'create', 'review']
			pageLoading: false,
			settingsCollapsed: false,
			node: 'none', // ['ok', 'processing', 'error', 'none']
			account: 'none',
			signatory: 'none',
			chooseOperationModal: false,
			statusModal: false,
			statusModalTitle: '',
			statusModalContent: '',
			dynamicGlobalProperties: {},
		},

		expiration_time_local: new Date().toISOString().split('.')[0].slice(0, -3),
		activeKey: '',
		proposal: {
			author: '',
			title: '',
			memo: '',
			expiration_time: '',
			proposed_operations: [],
			review_period_time: '',
			extensions: [],
		},
		proposals: [],
	},
	watch: {
		'settings.node': function (newNode, oldNode) {
			this.state.node = 'processing';
			var self = this;
			golos.config.set('websocket', newNode);
			golos.api.getDynamicGlobalProperties(function(err, result) {
				if (err) {
					self.state.node = 'error';
				} else {
					self.state.dynamicGlobalProperties = result;
					self.state.node = 'ok';
				}
			});
		},
		'settings.account': function (newAcc, oldAcc) {
			this.state.account = 'processing';
			var self = this;
			if (this.state.node != 'ok')
			{
				this.state.account = 'error';
				return;
			}
			golos.api.getAccounts([newAcc], function(err, result) {
				if (err || result.length == 0) {
					self.state.account = 'error';
				} else {
					self.state.account = 'ok';
					if (oldAcc != newAcc) {
						self.proposals = []
						self.findAllProposals(self.settings.account);
					}
				}
			});
		},
		'settings.signatory': function(newAcc, oldAcc) {
			this.state.signatory = 'processing';
			var self = this;
			if (this.state.node != 'ok')
			{
				this.state.signatory = 'error';
				return;
			}
			golos.api.getAccounts([newAcc], function(err, result) {
				if (err || result.length == 0) {
					self.state.signatory = 'error';
				} else
					self.state.signatory = 'ok';
			});
		},
		expiration_time_local: function(newTime, oldTime) {
			var date = new Date(newTime);

			date.setSeconds(4);
			this.proposal.expiration_time = date.toISOString().split('.')[0];
			date.setSeconds(0);
			this.proposal.review_period_time = date.toISOString().split('.')[0];
		},
	},
	methods: {
		switchToCreate: function() {
			this.proposal = this.newProposal();
			this.state.page = 'create';
		},
		newProposal: function() {
			return {
				author: '',
				title: '',
				memo: '',
				expiration_time: '',
				proposed_operations: [],
				review_period_time: '',
				extensions: [],
			};
		},
		submitProposal: function() {
			if (this.state.node != 'ok' || this.state.page != 'create')
				return;
			var key = this.activeKey;
			var self = this;
			golos.broadcast.proposalCreate(key,
				this.proposal.author,
				this.proposal.title,
				this.proposal.memo,
				this.proposal.expiration_time,
				this.proposal.proposed_operations,
				this.proposal.review_period_time,
				this.proposal.extensions,
				function(err, res) {
					if (err) {
						self.showError(err);
					} else {
						self.showProposalCreated(self.proposal.author, self.proposal.title);
						self.proposal = self.newProposal();
						self.activeKey = '';
					}
				}
			);
		},
		approveProposal: function() {
			var key = this.settings.signatoryKey;
			var self = this;

			var owner_approvals_to_add = [];
			var active_approvals_to_add = [];
			var posting_approvals_to_add = [];

			if (this.proposal.required_owner_approvals.includes(this.settings.signatory))
				owner_approvals_to_add.push(this.settings.signatory);
			if (this.proposal.required_active_approvals.includes(this.settings.signatory))
				active_approvals_to_add.push(this.settings.signatory);
			if (this.proposal.required_posting_approvals.includes(this.settings.signatory))
				posting_approvals_to_add.push(this.settings.signatory);

			golos.broadcast.proposalUpdate(key,
				this.proposal.author,
				this.proposal.title,
				active_approvals_to_add,
				[], // active_approvals_to_remove
				owner_approvals_to_add,
				[], // owner_approvals_to_remove
				posting_approvals_to_add,
				[], // posting_approvals_to_remove
				[], // key_approvals_to_add
				[], // key_approvals_to_remove
				[], // extensions
				function(err, res) {
					if (err) {
						self.showError(err)
					} else {
						self.proposal = self.newProposal();
						self.settings.signatoryKey = '';
						self.showProposalApproved();
					}
				}
			);
		},
		dynamicIconClass: function(state) {
			if (state == 'ok')
				return 'fa-check';
			if (state == 'processing')
				return ['fa-spinner', 'fa-pulse'];
			if (state == 'error')
				return 'fa-times';
			return '';
		},
		dynamicInputClass: function(state) {
			if (state == 'ok')
				return 'is-success';
			if (state == 'processing')
				return 'is-warning';
			if (state == 'error')
				return 'is-danger';
			return '';
		},
		deleteOperation: function(index) {
			this.proposal.proposed_operations.splice(index, 1);
		},
		newOperation: function(type) {
			this.proposal.proposed_operations.push({op: [type, this.getOperation(type)]});
			this.state.chooseOperationModal = false;
		},
		getOperation: function(type) {
			switch (type) {
				case 'vote':
					return {voter: this.settings.account, author: '', permlink: '', weight: 0};
				case 'transfer':
					return {from: this.settings.account, to: '', amount: '0.000 GOLOS', memo: ''};
				case 'delegate_vesting_shares':
					return {delegator: this.settings.account, delegatee: '', vesting_shares: '0.000000 GESTS'};
				case 'limit_order_create':
					return {owner: this.settings.account, orderid: Math.ceil(Date.now() / 1000), amount_to_sell: "1.000 GOLOS", min_to_receive: "1.000 GBG", fill_or_kill: false, expiration: "1969-12-31T23:59:59"}
				case 'account_witness_vote':
					return {account: this.settings.account, witness: '', approve: true};
				case 'convert':
					return {owner: this.settings.account, requestid: Math.ceil(Date.now() / 1000), amount: '0.000 GBG'};
				case 'account_update':
					return {
					    account: this.settings.account,
    				    memo_key: 'GLS1111111111111111111111111111111114T1Anm',
    				    json_metadata: "",
    				};
				case 'comment':
					return {
						    parent_author: '',
    					    parent_permlink: '',
    					    author: this.settings.account,
    					    permlink: '',
    					    title: "",
    					    body: "",
    					    json_metadata: "{}"
    					};
				case 'transfer_to_vesting':
					return {from: this.settings.account, to: this.settings.account, amount: '0.000 GOLOS'};
				case 'withdraw_vesting':
					return {account: this.settings.account, vesting_shares: '0.000000 GESTS'}
			}
		},
		previewProposal: function(author, title) {
			var proposal = this.proposals.find((prop) => {if (prop.author == author && prop.title == title) return true;});
			if (proposal == undefined) {
				this.proposals = [];
				this.findProposal(author, title);
			} else {
				var timeOffset = new Date().getTimezoneOffset() * 60 * 1000;
				var localTime = new Date(new Date(proposal.expiration_time + 'Z').valueOf() - timeOffset).toISOString().split('.')[0].slice(0, -3);
				this.expiration_time_local = localTime;
				this.proposal = cloneDeep(proposal);
				this.state.page = 'review';
			}
		},
		findProposal: function(author, title) {
			this.state.pageLoading = true;
			var self = this;
			golos.api.getProposedTransactions(author, this.proposals.length, 100, function(err, res) {
				if (err) {
					self.showError(err);
				} else {
					for (proposal of res) {
						self.proposals.push(proposal);
					}
					if (res.length == 100) {
						self.findProposal(author, title);
					} else {
						var proposal = self.proposals.find((prop) => {if (prop.author == author && prop.title == title) return true;});
						self.state.pageLoading = false;
						if (proposal == undefined) {
							self.showError('Proposal ' + author + '/' + title + ' not found');
						} else {
							self.previewProposal(author, title);
						}
					}
				}
			});
		},
		findAllProposals: function(author) {
			this.state.pageLoading = true;
			var self = this;
			golos.api.getProposedTransactions(author, this.proposals.length, 100, function(err, res) {
				if (err) {
					self.showError(err);
				} else {
					for (proposal of res) {
						self.proposals.push(cloneDeep(proposal));
					}
					if (res.length == 100) {
						self.findAllProposals(author);
					} else {
						self.state.pageLoading = false;
					}
				}
			});
		},
		showProposalApproved: function() {
			this.statusModalTitle = 'Proposal approved'
			this.$nextTick(function(){this.state.statusModal = true});
		},
		showProposalCreated: function(author, title) {
			this.statusModalTitle = 'Proposal created'
			this.statusModalContent = 'Proposal link: https://worthless-man.github.io/GolosMultisig/index.html?page=review&author=' +
				encodeURI(author) + '&title=' + encodeURI(title);
			this.$nextTick(function(){this.state.statusModal = true});
		},
		showError: function(err) {
			console.error(err);
			this.state.statusModalTitle = 'Error';
			this.state.statusModalContent = err;
			this.$nextTick(function(){this.state.statusModal = true});
		},
	},
	computed: {
		signatoryKeyRequirement: function() {
			if (this.proposal.required_owner_approvals != undefined &&
					this.proposal.required_active_approvals != undefined &&
					this.proposal.required_posting_approvals != undefined) {
				if (this.proposal.required_owner_approvals.includes(this.settings.signatory))
					return 'Owner';
				else if (this.proposal.required_active_approvals.includes(this.settings.signatory))
					return 'Active';
				else if (this.proposal.required_posting_approvals.includes(this.settings.signatory))
					return 'Posting';
				else
					return 'Signatory';
			} else {
				return '';
			}
		},
		proposal_editable: function() {
			return this.state.page == 'create';
		},
		expiration_date: {
			get: function() {
				return this.expiration_time_local.split('T')[0];
			},
			set: function(newDate) {
				this.expiration_time_local = newDate + 'T' + this.expiration_time_local.split('T')[1]
			},
		},
		expiration_time: {
			get: function() {
				return this.expiration_time_local.split('T')[1];
			},
			set: function(newTime) {
				this.expiration_time_local = this.expiration_time_local.split('T')[0] + 'T' + newTime;
			},
		},
	},
	mounted: function() {
		this.settings.node = 'wss://api.golos.blckchnd.com/ws';

		if (this.state.getParams.page == 'review' && this.state.getParams.author !== undefined && this.state.getParams.title !== undefined) {
			this.state.page = 'review';
			this.previewProposal(decodeURI(this.state.getParams.author), decodeURI(this.state.getParams.title));
		}
	},
})
