# UI Connect Component

Glue Stack uses its own Connect component for data fetching in React.

Ordinarily, I prefer to use well tested, standard libraries for large problems like this but I couldn't find a library that felt right. In the case the problem didn't seem that complicated so I decided to write my own.

## History and Prior Art

Glue stack started off using [React Refetch](https://github.com/heroku/react-refetch) and I really, really wanted to like it. Their docs made the tool sound like it was made for me and Glue Stack. They too found Redux largely overkill for their applications with minimal client state and heavily focused around API requests.

I found myself running into issues because they are focused around URL strings and other limitations like [this issue I posted](https://github.com/heroku/react-refetch/issues/182).

URL strings just felt like the wrong abstraction and I wanted to use the power of promises.

[React Resolver](https://github.com/ericclemmons/react-resolver) used promises but [didn't handle their state].(https://github.com/ericclemmons/react-resolver/issues/72).

Honorable Mentions

- [React Data Fetching](https://github.com/CharlesMangwa/react-data-fetching)
- [Redial](https://github.com/markdalgleish/redial)
- [Async Props](https://github.com/ryanflorence/async-props)

I'm sure there's others too.

I originally used a higher order component for Connect but found it was slighly awakward to do stuff with props. HOC's look very natural to me now but I know I was super confused when I first saw them. Render props look uglier but I'm starting to like them.

## Requirements

- Promise based
  - Leverage a solid Javascript abstraction
- State of promise is passed in as props
  - So we know if the request is loading or finished
- Automatically run when dependant props changes
  - For lists e.g if the page changes the next page is fetched
- Can be called with data like normal functions
  - For create or patch requests so we can send data and monitor the request
- Can be 'subscribe' to the success event
  - So we can easily populate the component state on a single item.
- Single prop per promise
  - So we can easily pass a single abstraction around

## Usage

It is possible to achieve all these requirements with plain old react but I wanted to find a common and consistent interface that I can use throughout the app. I think that's Connect's biggest strength. You can just pass a single prop around and do the common things CRUD applications should do.

### Lists

Lists often need automatic fetches based on props.

Before:

```
class Users extends Component {
	state = { users: [], pending: false, fulfilled: true, error: false };

	componentDidMount() {
		this.handleProps();
	}

	componentDidUpdate(prevProps) {
		this.handleProps(prevProps);
	}

	handleProps = prevProps => {
		if (!prevProps || prevProps.page !== this.props.page) {
			this.fetch();
		}
	};

	fetch = () => {
		this.setState({ pending: true, error: false });
		fetch(`users?page=${this.props.page}`)
			.then(res => res.json())
			.then(res => {
				this.setState({
					users: res,
					pending: false,
					success: true,
				});
			})
			.catch(err => {
				this.setState({ pending: false, error: err });
			});
	};

	render() {
		const { users, error, pending } = this.state;
		return (
			<div>
				<button onClick={this.fetch}>Refresh</button>
				{error && <p>Error: {error}</p>}
				<p>{pending && "Pending..."}</p>
				<ul>{users.map(item => <li key={item.id}>{item.name}</li>)}</ul>
			</div>
		);
	}
}
```

After:

```
const Users = ({ findAll }) => (
	<div>
        <button onClick={findAll.refresh}>Refresh</button>
		{findAll.rejected && <p>Error: {findAll.reason}</p>}
		<p>{findAll.pending && "Pending..."}</p>
		<ul>
			{findAll.value &&
				findAll.value.map(item => <li key={item.name}>{item.name}</li>)}
		</ul>
	</div>
);

const ConnectedUsers = props => {
	return (
		<Connect
			findAll={{
				params: { page: props.page },
				promise: params =>
					fetch(`users?page=${params.page}`).then(res => res.json()),
			}}
		>
			{({ findAll }) => <Users {...props} findAll={findAll} />}
		</Connect>
	);
};
```

### Patches

A patch is just another request we'll need to track.

```
class Create extends Component {
	handleCreate = () => {
		this.props.create.call({ name: "new thing" }).then(result => {
			// we can do some other stuff here like refresh a list for example.
		});
	};

	render() {
		const { create } = this.props;
		return (
			<div>
				<button onClick={this.handleCreate}>
					{create.pending ? "Creating..." : "Create"}
				</button>
			</div>
		);
	}
}

const ConnectedCreate = props => {
	return (
		<Connect
			create={{
				promise: params =>
					fetch("endpoint", {
						headers: {
							"Content-Type": "application/json",
						},
						method: "PATCH",
						body: JSON.stringify({ params }),
					}),
			}}
		>
			{({ create }) => <Create {...props} create={create} />}
		</Connect>
	);
};
```

### Edit Views

I often base my edit views based on some sort of props, usually an id from the url. This is similar to the list example, where we need to refetch based on prop changes, but we also need to update the component state of the edit view which holds the data for the form.

```
class Form extends Component {
	state = { name: "" };

	componentDidMount() {
		this.props.findOne.subscribe(value => {
			const { name } = value.data;
			this.setState({ name });
		});
	}

	handleFormInput = evt => {
		this.setState({ [evt.target.name]: evt.target.value });
	};

	render() {
		const { findOne } = this.props;
		const { name } = this.state;
		return (
			<div>
				{findOne.pending && <p>Pending...</p>}
				<input
					name="name"
					type="text"
					value={name}
					onChange={this.handleFormInput}
				/>
			</div>
		);
	}
}

const ConnectedForm = props => {
	return (
		<Connect
			findOne={{
				params: { id: props.id },
				promise: params => fetch(`user/${params.id}`).then(res => res.json()),
			}}
		>
			{({ findOne }) => <Form {...props} findOne={findOne} />}
		</Connect>
	);
};
```

### Hande Update

We also support a handleUpdate property on each promise so that you can easily make updates in deeply nested components. Check out the TablePagination component.

### Promise Abstractions

Because Connect is promise based you are free to move your promises into other files for separation. That's what I do.

## How Do I Get It?

Its not a module you can just `yarn add` just yet. I don't have any tests or a name for it and quite frankly don't know how to add it to NPM :P

You can just copy the Connect.js file if you'd like to use it. Its only 142 lines of code plus a quick example at the bottom.

## What's Next?

Write tests and publish it to NPM.

I might try and make it easy to cache responses based on their params to get a smoother user experience that's closer to redux but with less mental overhead.

## Glue Stack

If you like any of the patterns you see here make sure to give us a star and be sure to checkout the rest of Glue Stack for more!
