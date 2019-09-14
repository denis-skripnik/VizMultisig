Vue.component('comment-component', {
	template: `
<div class="tile is-parent">
	<div class="tile is-child notification has-background-info">
		<label class="label has-text-centered">Post</label>
		<div class="container">
			<div class="field">
				<label class="label">Title</label>
				<p class="control is-expanded">
				<input class="input" type="text" v-model.lazy="title" :disabled="editable == false">
				</p>
			</div>
			<label class="label">Body</label>
			<simplemde v-model="body" :disabled="editable == false">
			</simplemde>
			<div v-if="editable">
			<label class="label">Tags</label>
			<div class="tags notification">
				<span v-for="(tag, index) in tags" class="tag is-primary">
					<input :value="tag" @change="updateTag(index, $event.target.value.trim())">
					<button class="delete is-small" @click="removeTag(index)"></button>
				</span>
					<button class="is-small" @click="addTag()"><i class="fas fa-plus"></i></button>
				<span>
				</span>
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
			title: this.value.title,
			body: this.value.body,
			tags: [],
			assoc: {
				"а": "a",
				"б": "b",
				"в": "v",
				"ґ": "g",
				"г": "g",
				"д": "d",
				"е": "e",
				"ё": "yo",
				"є": "ye",
				"ж": "zh",
				"з": "z",
				"и": "i",
				"і": "i",
				"ї": "yi",
				"й": "ij",
				"к": "k",
				"л": "l",
				"м": "m",
				"н": "n",
				"о": "o",
				"п": "p",
				"р": "r",
				"с": "s",
				"т": "t",
				"у": "u",
				"ф": "f",
				"х": "kh",
				"ц": "cz",
				"ч": "ch",
				"ш": "sh",
				"щ": "shch",
				"ъ": "xx",
				"ы": "y",
				"ь": "x",
				"э": "ye",
				"ю": "yu",
				"я": "ya"
			},
		};
	},
	watch: {
		body: function(newValue) {
			this.update('body', newValue);
		},
		title: function(newValue) {
			this.$emit('input', { ...this.value, ['title']: newValue, ['permlink']: this.transform(newValue, '-') + '-' + Date.now() });
		},
	},
	methods: {
		addTag: function() {
			this.tags.push('');
			this.updateTags();
		},
		removeTag: function(index) {
			this.tags.splice(index, 1);
			this.updateTags();
		},
		updateTag: function(index, value) {
			this.tags[index] = value;
			this.updateTags();
		},
		updateTags: function() {
			var json = {tags:[]};
			for (tag of this.tags) {
				json.tags.push(this.transform(tag, '-'));
			}
			this.$emit('input', { ...this.value, ['parent_permlink']: json.tags[0], ['json_metadata']: JSON.stringify(json) });
		},
		transform: function(str, spaceReplacement) {
			if (!str) {
				return "";
			}
			var new_str = '';
			var ru = '';
			for (var i = 0; i < str.length; i++) {
				var strLowerCase = str[i].toLowerCase();

				if (strLowerCase === " " && spaceReplacement) {
					new_str += spaceReplacement;

					continue;
				}

				if (!this.assoc[strLowerCase]) {
					new_str += strLowerCase;
				} else {
					new_str += this.assoc[strLowerCase];
					// Если в теге найдены русские символы - стало быть нам нужно добавить префикс ru-- для публикации на голосе
					ru = 'ru--';
				}
			}
			return ru + new_str;
		},
		suicide() {
			this.$emit('delete-operation');
		},
		update(key, value) {
			this.$emit('input', { ...this.value, [key]: value })
		},
	},
})

