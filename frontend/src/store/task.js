import { observable, toJS } from "mobx";

class User {
	@observable id;
	@observable name = "";
	@observable notes = "";
	@observable active = true;

	constructor(store) {
		this.store = store;
	}

	load() {
		this.store.load(this.id).then(result => {
			const { name, notes } = result.data;
			this.name = name;
			this.notes = notes;
		});
	}

	save() {
		return this.store.save(this);
	}

	toJS() {
		return toJS(this);
	}
}

export default User;