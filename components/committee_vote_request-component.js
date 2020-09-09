Vue.component('committee_vote_request-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Committee vote request</label>
			<div class="field">
				<label class="label">voter</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.voter" @change="update('voter', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
			<label class="label">request_id</label>
			<p class="control has-icons-left has-icons-right">
			<input class="input" type="number" :value="value.request_id" @input="update('request_id', isNaN(parseInt($event.target.value)) ? 1 : Math.min(Math.max(parseInt($event.target.value), 1), 1000000000000))" :disabled="!editable">
			<span class="icon is-small is-left">
				<i class="fas fa-chevron-circle-up"></i>
			</span>
			</p>
		</div>
			<div class="field">
				<label class="label">vote_percent</label>
				<p class="control has-icons-left has-icons-right">
				<input class="input" type="number" :value="value.vote_percent" @input="update('vote_percent', isNaN(parseInt($event.target.value)) ? 0 : Math.min(Math.max(parseInt($event.target.value), 0), 10000))" :disabled="!editable">
				<span class="icon is-small is-left">
					<i class="fas fa-chevron-circle-up"></i>
				</span>
				</p>
			</div>
			</div>
		<button @click="toggleMode()" class="button" style="position: absolute;left: 0.5rem;top: 0.5rem;">
			<span class="icon is-small">
				<i :class="['fas', mode == 'simple' ? 'fa-file-alt' : 'fa-code']"></i>
			</span>
		</button>
		<button v-if="editable" class="delete" @click="suicide()">
		</button>
</div>
	`,
	props: {
		value: Object,
		editable: Boolean,
	},
	data: function() {
		return {
			mode: 'simple' // ['simple', 'advanced']
		}
	},
	computed: {
		vote_percent: {
			get: function() {
				return this.value.vote_percent / 100.0;
			},
			set: function(newValue) {
				newValue = newValue.replace(',', '.');
				var match = newValue.match(/\d{1,3}(?:\.\d{1,2})?/);
				var w = match != null ? Math.ceil(parseFloat(match[0]) * 100) : 10000;
				if (w > 10000)
					w = 10000;
				this.update('vote_percent', w);
			},
		},
	},
	methods: {
		suicide() {
			this.$emit('delete-operation');
		},
		toggleMode() {
			this.mode = this.mode == 'simple' ? 'advanced' : 'simple';
		},
		update(key, value) {
			this.$emit('input', { ...this.value, [key]: value })
		},
	},
})

