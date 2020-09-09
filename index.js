history.replaceState({locationSearch: window.location.search}, 'VizMultisigInterface', window.location.origin + window.location.pathname + window.location.search);

viz.config.set('websocket', 'https://viz.lexai.host');

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
			if (newNode == oldNode)
				return;
			this.state.node = 'processing';
			var self = this;
			viz.config.set('websocket', newNode);
			viz.api.getDynamicGlobalProperties(function(err, result) {
				if (err) {
					self.state.node = 'error';
				} else {
					self.state.dynamicGlobalProperties = result;
					self.state.node = 'ok';
				}
			});
		},
		'settings.account': function (newAcc, oldAcc) {
			if (newAcc == oldAcc)
				return;
			this.state.account = 'processing';
			var self = this;
			viz.api.getAccounts([newAcc], function(err, result) {
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
			if (newAcc == oldAcc)
				return;
			this.state.signatory = 'processing';
			var self = this;
			viz.api.getAccounts([newAcc], function(err, result) {
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
			viz.broadcast.proposalCreate(key,
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

			var master_approvals_to_add = [];
			var active_approvals_to_add = [];
			var regular_approvals_to_add = [];

			if (this.proposal.required_master_approvals.includes(this.settings.signatory) &&
				!this.proposal.available_master_approvals.includes(this.settings.signatory))
				master_approvals_to_add.push(this.settings.signatory);
			if (this.proposal.required_active_approvals.includes(this.settings.signatory) &&
				!this.proposal.available_active_approvals.includes(this.settings.signatory))
				active_approvals_to_add.push(this.settings.signatory);
			if (this.proposal.required_regular_approvals.includes(this.settings.signatory) &&
				!this.proposal.available_regular_approvals.includes(this.settings.signatory))
				regular_approvals_to_add.push(this.settings.signatory);

			var author = this.proposal.author;
			var title = this.proposal.title;
			viz.broadcast.proposalUpdate(key,
				author,
				title,
				active_approvals_to_add,
				[], // active_approvals_to_remove
				master_approvals_to_add,
				[], // master_approvals_to_remove
				regular_approvals_to_add,
				[], // regular_approvals_to_remove
				[], // key_approvals_to_add
				[], // key_approvals_to_remove
				[], // extensions
				function(err, res) {
					if (err) {
						self.showError(err)
					} else {
						var index = self.proposals.findIndex((prop) => {if (prop.author == author && prop.title == title) return true;});
						self.proposals[index].available_master_approvals = self.mergeArrays(self.proposals[index].available_master_approvals, master_approvals_to_add);
						self.proposals[index].available_active_approvals = self.mergeArrays(self.proposals[index].available_active_approvals, active_approvals_to_add);
						self.proposals[index].available_regular_approvals = self.mergeArrays(self.proposals[index].available_regular_approvals, regular_approvals_to_add);
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
				case 'award':
					return {initiator: this.settings.account, receiver: '', custom_sequence: 0, energy: 0, memo: '', beneficiaries: []};
				case 'transfer':
					return {from: this.settings.account, to: '', amount: '0.000 VIZ', memo: ''};
				case 'delegate_vesting_shares':
					return {delegator: this.settings.account, delegatee: '', vesting_shares: '0.000000 SHARES'};
				case 'account_witness_vote':
					return {account: this.settings.account, witness: '', approve: true};
				case 'account_update':
					return {
					    account: this.settings.account,
    				    memo_key: 'GLS1111111111111111111111111111111114T1Anm',
    				    json_metadata: "",
    				};
				case 'transfer_to_vesting':
					return {from: this.settings.account, to: this.settings.account, amount: '0.000 VIZ'};
				case 'withdraw_vesting':
					return {account: this.settings.account, vesting_shares: '0.000000 SHARES'}
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
		mergeArrays: function(a, b) {
			return a.concat(b.filter(function (item) {
				return a.indexOf(item) < 0;
			}));
		},
		findProposal: function(author, title) {
			this.state.pageLoading = true;
			var self = this;
			viz.api.getProposedTransactions(author, this.proposals.length, 100, function(err, proposals) {
				if (err) {
					self.showError(err);
				} else {
					mergeArrays = self.mergeArrays;
					var nicknames = [];
					for (proposal of proposals) {
						nicknames = mergeArrays(nicknames, proposal.required_master_approvals);
						nicknames = mergeArrays(nicknames, proposal.required_active_approvals);
						nicknames = mergeArrays(nicknames, proposal.required_regular_approvals);
					}
					viz.api.getAccounts(nicknames, function(error, accounts){
						if (error) {
							self.showError(error);
						}
						var accs = {};
						for (account of accounts) {
							accs[account.name] = {master_authority: account.master_authority, active_authority: account.active_authority, regular_authority: account.regular_authority};
						}
						for (proposal of proposals) {
							var master = [];
							var active = [];
							var regular = [];
							for (acc of proposal.required_master_approvals) {
								if (accs[acc].master_authority.key_auths.length != 0) {
									master.push(acc)
								}
								master = mergeArrays(master, accs[acc].master_authority.account_auths.map(function(val){return val[0]}));
							}
							for (acc of proposal.required_active_approvals) {
								if (accs[acc].active_authority.key_auths.length != 0) {
									active.push(acc)
								}
								active = mergeArrays(active, accs[acc].active_authority.account_auths.map(function(val){return val[0]}));
							}
							for (acc of proposal.required_regular_approvals) {
								if (accs[acc].regular_authority.key_auths.length != 0) {
									regular.push(acc)
								}
								regular = mergeArrays(regular, accs[acc].regular_authority.account_auths.map(function(val){return val[0]}));
							}
							proposal.required_master_approvals = master;
							proposal.required_active_approvals = active;
							proposal.required_regular_approvals = regular;
							self.proposals.push(cloneDeep(proposal));
						}
						if (proposals.length == 100) {
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
					});
				}
			});
		},
		findAllProposals: function(author) {
			this.state.pageLoading = true;
			var self = this;
			viz.api.getProposedTransactions(author, this.proposals.length, 100, function(err, proposals) {
				if (err) {
					self.showError(err);
				} else {
					mergeArrays = self.mergeArrays;
					var nicknames = [];
					for (proposal of proposals) {
						nicknames = mergeArrays(nicknames, proposal.required_master_approvals);
						nicknames = mergeArrays(nicknames, proposal.required_active_approvals);
						nicknames = mergeArrays(nicknames, proposal.required_regular_approvals);
					}
					viz.api.getAccounts(nicknames, function(error, accounts){
						if (error) {
							self.showError(error);
						}
						var accs = {};
						for (account of accounts) {
							accs[account.name] = {master_authority: account.master_authority, active_authority: account.active_authority, regular_authority: account.regular_authority};
						}
						for (proposal of proposals) {
							var master = [];
							var active = [];
							var regular = [];
							for (acc of proposal.required_master_approvals) {
								if (accs[acc].master_authority.key_auths.length != 0) {
									master.push(acc)
								}
								master = mergeArrays(master, accs[acc].master_authority.account_auths.map(function(val){return val[0]}));
							}
							for (acc of proposal.required_active_approvals) {
								if (accs[acc].active_authority.key_auths.length != 0) {
									active.push(acc)
								}
								active = mergeArrays(active, accs[acc].active_authority.account_auths.map(function(val){return val[0]}));
							}
							for (acc of proposal.required_regular_approvals) {
								if (accs[acc].regular_authority.key_auths.length != 0) {
									regular.push(acc)
								}
								regular = mergeArrays(regular, accs[acc].regular_authority.account_auths.map(function(val){return val[0]}));
							}
							proposal.required_master_approvals = master;
							proposal.required_active_approvals = active;
							proposal.required_regular_approvals = regular;
							self.proposals.push(cloneDeep(proposal));
						}
						if (proposals.length == 100) {
							self.findAllProposals(author);
						} else {
							self.state.pageLoading = false;
						}
					});
				}
			});
		},
		showProposalApproved: function() {
			this.state.statusModalTitle = 'Proposal approved'
			this.state.statusModalContent = 'Proposal successfully approved';
			this.state.pageLoading = false;
			this.$nextTick(function(){this.state.statusModal = true});
		},
		showProposalCreated: function(author, title) {
			this.state.statusModalTitle = 'Proposal created'
			this.state.statusModalContent = 'Proposal link: https://worthless-man.github.io/VizMultisig/index.html?page=review&author=' +
				encodeURI(author) + '&title=' + encodeURI(title);
			this.state.pageLoading = false;
			this.$nextTick(function(){this.state.statusModal = true});
		},
		showError: function(err) {
			console.error(err);
			this.state.statusModalTitle = 'Error';
			this.state.statusModalContent = err;
			this.state.pageLoading = false;
			this.$nextTick(function(){this.state.statusModal = true});
		},
		updatePage: function(newLocationSearch, noPush) {
			var searchParams = new URLSearchParams(newLocationSearch);
			var params = {};
			for(var pair of searchParams) {
				params[pair[0]] = pair[1]; 
			}
			if (params.node) {
				this.settings.node = params.node;
				viz.config.set('websocket', params.node);
			}
			if (params.multisig)
				this.settings.account = params.multisig;
			if (params.signatory)
				this.settings.account = params.signatory;
			if (params.page == 'review' && params.author !== undefined && params.title !== undefined) {
				this.state.page = 'review';
				this.previewProposal(decodeURI(params.author), decodeURI(params.title));
			} else if (params.page == 'dashboard') {
				this.state.page = 'dashboard';
			} else if (params.page == 'create') {
				this.switchToCreate();
			} else if (params.page == 'main') {
				this.state.page = 'main';
			}
			if (!noPush)
				history.pushState({locationSearch: newLocationSearch}, 'VizMultisigInterface', window.location.origin + window.location.pathname + newLocationSearch);
		},
		onpopstateCallback: function(event) {
			if (history.state && history.state.locationSearch) {
				this.updatePage(history.state.locationSearch, true);
			}
		},
	},
	computed: {
		signatoryKeyRequirement: function() {
			if (this.proposal.required_master_approvals != undefined &&
				this.proposal.required_active_approvals != undefined &&
				this.proposal.required_regular_approvals != undefined) {
				if (this.proposal.required_master_approvals.includes(this.settings.signatory))
				return 'Master';
				else if (this.proposal.required_active_approvals.includes(this.settings.signatory))
				return 'Active';
				else if (this.proposal.required_regular_approvals.includes(this.settings.signatory))
				return 'Regular';
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
		window.addEventListener('popstate', this.onpopstateCallback, false);
		this.settings.node = 'https://viz.lexai.host';
		this.updatePage(window.location.search);
	},
})
