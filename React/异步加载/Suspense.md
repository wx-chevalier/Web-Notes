# Suspense

React Suspense is all about handling transitions between views that have asynchronous data requirements

```js
import { createCache } from "react-cache";
import { createResource } from "react-cache";

export let cache = createCache();

export let InvoiceResource = createResource(id => {
  return fetch(`/invoices/${id}`).then(response => {
    return response.json();
  });
});
```

```js
import cache from "./cache";
import InvoiceResource from "./InvoiceResource";

let Invoice = ({ invoiceId }) => {
  let invoice = InvoiceResource.read(cache, invoiceId);
  return <h1>{invoice.number}</h1>;
};
```

React starts rendering (in memory).
It hits that InvoicesResource.read() call.
The cache will be empty for the key (the id is the key) so it will call the function we provided to createResource, firing off the asynchronous fetch.
AND THEN THE CACHE WILL THROW THE PROMISE WE RETURNED (Yeah, I’ve never thought about throwing anything but errors either, but you can throw window if you want.) After a throw, no more code is executed.
React waits for the promise to resolve.
The promise resolves.
React tries to render Invoices again (in memory).
It hits InvoicesResource.read() again.
Data is in the cache this time so our data can be returned synchronously from ApiResource.read().
React renders the page to the DOM

```js
// the store and reducer
import { createStore } from "redux";
import { connect } from "react-redux";

let reducer = (state, action) => {
  if (action.type === "LOADED_INVOICE") {
    return {
      ...state,
      invoice: action.data
    };
  }
  return state;
};

let store = createStore(reducer);

/////////////////////////////////////////////
// the action
function fetchInvoice(dispatch, id) {
  fetch(`/invoices/${id}`).then(response => {
    dispatch({
      type: "LOADED_INVOICE",
      data: response.json()
    });
  });
}

/////////////////////////////////////////////
// the component, all connected up
class Invoice extends React.Component {
  componentDidMount() {
    fetchInvoice(this.props.dispatch, this.props.invoiceId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.invoiceId !== this.props.invoiceId) {
      fetchInvoice(this.props.dispatch, this.props.invoiceId);
    }
  }

  render() {
    if (!this.props.invoice) {
      return null;
    }
    return <h1>{invoice.number}</h1>;
  }
}

export default connect(state => {
  return { invoices: state.invoices };
})(Invoices);
```

```js
import React, { Suspense, Fragment, memo } from "react";
import { unstable_createResource } from "react-cache";

const Fetcher = unstable_createResource(() =>
  fetch("https://jsonplaceholder.typicode.com/todos").then(r => r.json())
);

const List = () => {
  const data = Fetcher.read();
  return (
    <ul>
      {data.map(item => (
        <li style={{ listStyle: "none" }} key={item.id}>
          {item.title}
        </li>
      ))}
    </ul>
  );
};

const App = () => (
  <Fragment>
    <h2 style={{ textAlign: "center" }}>{`React: ${React.version} Demo`}</h2>
    <Suspense fallback={<div>Loading...</div>}>
      <List />
    </Suspense>
  </Fragment>
);

const MemoApp = memo(App);

export default MemoApp;
```
