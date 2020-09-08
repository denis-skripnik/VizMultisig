Vue.component('award-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Award</label>
			<div class="field">
				<label class="label">initiator</label>
				<p class="control has-icons-left">
				<input class="input" type="text" :value="value.initiator" @change="update('initiator', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
				<label class="label">receiver</label>
				<p class="control has-icons-left has-icons-right">
				<input class="input" type="text" :value="value.receiver" @change="update('receiver', $event.target.value.trim())" :disabled="editable == false">
				<span class="icon is-small is-left">
					<i class="fas fa-user-circle"></i>
				</span>
				</p>
			</div>
			<div class="field">
			<label class="label">custom_sequence</label>
			<p class="control has-icons-left has-icons-right">
			<input class="input" type="number" :value="value.custom_sequence" @input="update('custom_sequence', isNaN(parseInt($event.target.value)) ? 0 : Math.min(Math.max(parseInt($event.target.value), 0), 10000000000000))" :disabled="!editable">
			<span class="icon is-small is-left">
				<i class="fas fa-chevron-circle-up"></i>
			</span>
			</p>
		</div>
			<div class="field">
				<label class="label">energy</label>
				<p class="control has-icons-left has-icons-right">
				<input class="input" type="number" :value="value.energy" @input="update('energy', isNaN(parseInt($event.target.value)) ? 0 : Math.min(Math.max(parseInt($event.target.value), 0), 10000))" :disabled="!editable">
				<span class="icon is-small is-left">
					<i class="fas fa-chevron-circle-up"></i>
				</span>
				</p>
			</div>
			<div class="field">
			<label class="label">memo</label>
			<p class="control has-icons-left has-icons-right">
			<input class="input" type="text" :value="value.memo" @change="update('memo', $event.target.value.trim())" :disabled="editable == false">
			<span class="icon is-small is-left">
				<i class="fas fa-clipboard"></i>
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
		energy: {
			get: function() {
				return this.value.energy / 100.0;
			},
			set: function(newValue) {
				newValue = newValue.replace(',', '.');
				var match = newValue.match(/\d{1,3}(?:\.\d{1,2})?/);
				var w = match != null ? Math.ceil(parseFloat(match[0]) * 100) : 10000;
				if (w > 10000)
					w = 10000;
				this.update('energy', w);
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

