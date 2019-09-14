Vue.component('vote-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Vote</label>
		<div v-if="mode == 'simple'" class="container">
			<div class="field">
				<label class="label">Post</label>
				<p class="control has-icons-left">
				<input class="input" type="text" v-model.lazy.trim="link" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-link"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<label class="label">Weight</label>
				<p class="control has-icons-left has-icons-right">
				<input class="input" type="number" v-model.lazy.trim="weight" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-chevron-circle-up"></i>
				</span>
				<span class="icon is-small is-right">
					<i class="fas fa-percent"></i>
				</span>
				</p>
			</div>
		</div>
		<div v-else>
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
				<label class="label">author</label>
				<p class="control has-icons-left has-icons-right">
				<input class="input" type="text" :value="value.author" @change="update('author', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<label class="label">permlink</label>
				<p class="control has-icons-left has-icons-right">
				<input class="input" type="text" :value="value.permlink" @change="update('permlink', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-link"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<label class="label">weight</label>
				<p class="control has-icons-left has-icons-right">
				<input class="input" type="number" :value="value.weight" @input="update('weight', isNaN(parseInt($event.target.value)) ? 0 : Math.min(Math.max(parseInt($event.target.value), 0), 10000))" :disabled="!editable">
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
		link: {
			get: function() {
				return 'https://golos.id/@' + this.value.author +'/'+ this.value.permlink;
			},
			set: function(newValue) {
				var match = newValue.match(/@([\w-]+)\/([\w-]+)/i);
				if (match != null) {
					this.$emit('input', { ...this.value, 'author': match[1], 'permlink': match[2] });
				}
			},
		},
		weight: {
			get: function() {
				return this.value.weight / 100.0;
			},
			set: function(newValue) {
				newValue = newValue.replace(',', '.');
				var match = newValue.match(/\d{1,3}(?:\.\d{1,2})?/);
				var w = match != null ? Math.ceil(parseFloat(match[0]) * 100) : 10000;
				if (w > 10000)
					w = 10000;
				this.update('weight', w);
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

