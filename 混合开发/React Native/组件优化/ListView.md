# ListView

## Event Handler(事件处理)

Let’s start by using the <ListView> component. In this section, we are going to build an app that displays the New York Times Bestseller’s List and lets us view data about each book. If you’d like, you can grab your own API token from the NYTimes. Otherwise, use the API token included in the sample code.

![](http://7xkt0f.com1.z0.glb.clouddn.com/%E6%89%93%E8%BD%A6%E6%92%92booklist_header.png)

Lists are extremely useful for mobile development, and you will notice that many mobile user interfaces feature them as a central element. A <ListView> is literally just a list of views, optionally with special views for section dividers, headers, or footers. For example, here are a few ListViews as seen in the Dropbox, Twitter, and iOS Settings apps.

![](http://7xkt0f.com1.z0.glb.clouddn.com/cadsca1twitter.png)

![](http://7xkt0f.com1.z0.glb.clouddn.com/fcasqsettings_root.png)

ListViews are a good example of where React Native shines, because it can leverage its host platform. On mobile, the native ListView element is usually highly optimized so that rendering is smooth and stutter-free. If you expect to render a very large number of items in your ListView, you should try to keep the child views relatively simple, to try and reduce stutter.
The basic React Native ListView component requires two props: dataSource and renderRow. dataSource is, as the name implies, a source of information about the data that needs to be rendered. renderRow should return a component based on the data from one element of the dataSource.
This basic usage is demonstrated in SimpleList.js. We’ll start by adding a dataSource to our <SimpleList> component. A ListView.DataSource needs to implement the rowHasChanged method. Here’s a simple example:

```
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
```

To set the actual contents of a dataSource, we use cloneWithRows. Let’s return the dataSource in our getInitialState call.

```
getInitialState: function() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return {
    dataSource: ds.cloneWithRows(['a', 'b', 'c', 'a longer example', 'd', 'e'])
  };
}
```

The other prop we need is renderRow, which should be a function that returns some JSX based on the data for a given row.

```
_renderRow: function(rowData) {
  return <Text style={styles.row}>{rowData}</Text>;
}
```

Now we can put it all together to see a simple ListView, by rendering a ListView like so:

```
<ListView
  dataSource={this.state.dataSource}
  renderRow={this._renderRow}
  />
```

It looks like this:
![](http://7xkt0f.com1.z0.glb.clouddn.com/fcasewqsimplelist.png)
What if we want to do a little more? Let’s create a ListView with more complex data. We will be using the NYTimes API to create a simple BestSellers application, which renders the bestsellers list.
First, we initialize our data source to be empty, because we’ll need to fetch the data:

```
getInitialState: function() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return {
    dataSource: ds.cloneWithRows([])
  };
}
```

Then, we add a method for fetching data, and update the data source once we have it. This method will get called from componentDidMount.

```
_refreshData: function() {
  var endpoint = 'http://api.nytimes.com/svc/books/v3/lists/hardcover-fiction?response-format=json&api-key=' + API_KEY;
  fetch(endpoint)
    .then((response) => response.json())
    .then((rjson) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rjson.results.books)
      });
    });
}
```

Each book returned by the NYTimes API has three properties: coverURL, author, and title. We update the ListView’s render function to return a component based on those props.

```
  _renderRow: function(rowData) {
    return <BookItem coverURL={rowData.book_image}
                     title={rowData.title}
                    author={rowData.author}/>;
  },
```

We’ll also toss in a header and footer component, to demonstrate how these work. Note that for a ListView, the header and footer are not sticky; they scroll with the rest of the list. If you want a sticky header or footer, it’s probably easiest to render them separately from the <ListView> component.

```
  _renderHeader: function() {
    return (<View style={styles.sectionDivider}>
      <Text style={styles.headingText}>
        Bestsellers in Hardcover Fiction
      </Text>
      </View>);
  },

  _renderFooter: function() {
    return(
      <View style={styles.sectionDivider}>
        <Text>
          Data from the New York Times bestsellers list.
        </Text>
      </View>
      );
  },
```

All together, the BookList application consists of two files: BookListV2.js and BookItem.js. (BookList.js is a simpler file which omits fetching data from an API, and is included in the Github repository for your reference.)

```
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} = React;

var BookItem = require('./BookItem');
var API_KEY = '73b19491b83909c7e07016f4bb4644f9:2:60667290';

var BookList = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([])
    };
  },

  componentDidMount: function() {
    this._refreshData();
  },

  _renderRow: function(rowData) {
    return <BookItem coverURL={rowData.book_image}
                     title={rowData.title}
                     author={rowData.author}/>;
  },

  _renderHeader: function() {
    return (<View style={styles.sectionDivider}>
      <Text style={styles.headingText}>
        Bestsellers in Hardcover Fiction
      </Text>
      </View>);
  },

  _renderFooter: function() {
    return(
      <View style={styles.sectionDivider}>
        <Text>Data from the New York Times bestsellers list.</Text>
      </View>
      );
  },

  _refreshData: function() {
    var endpoint = 'http://api.nytimes.com/svc/books/v3/lists/hardcover-fiction?response-format=json&api-key=' + API_KEY;
    fetch(endpoint)
      .then((response) => response.json())
      .then((rjson) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rjson.results.books)
        });
      });
  },

  render: function() {
    return (
        <ListView
          style={{marginTop: 24}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 24
  },
  list: {
    flex: 1,
    flexDirection: 'row'
  },
  listContent: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flex: 1,
    fontSize: 24,
    padding: 42,
    borderWidth: 1,
    borderColor: '#DDDDDD'
  },
  sectionDivider: {
    padding: 8,
    backgroundColor: '#EEEEEE',
    alignItems: 'center'
  },
  headingText: {
    flex: 1,
    fontSize: 24,
    alignSelf: 'center'
  }
});

module.exports = BookList;
```

The <BookItem> is a simple component that handles rendering each child view in the list.

```
// BookItem.js
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} = React;


var styles = StyleSheet.create({
  bookItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 2,
    padding: 5
  },
  cover: {
    flex: 1,
    height: 150,
    resizeMode: 'contain'
  },
  info: {
    flex: 3,
    alignItems: 'flex-end',
    flexDirection: 'column',
    alignSelf: 'center',
    padding: 20
  },
  author: {
    fontSize: 18
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

var BookItem = React.createClass({
  propTypes: {
    coverURL: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View style={styles.bookItem}>
        <Image style={styles.cover} source={{uri: this.props.coverURL}}/>
        <View style={styles.info}>
          <Text style={styles.author}>{this.props.author}</Text>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
      </View>
      );
  }
});

module.exports = BookItem;
```

If you have complex data, or very long lists, you will need to pay attention to the performance optimizations enabled by some of ListView’s more complex, optional properties. For most usages, however, this will suffice.

## SwipeItem

### [react-native-swipe-list-view](https://github.com/jemise111/react-native-swipe-list-view)

![](https://camo.githubusercontent.com/ee4f37ccfd1895e3a6875dcfc2ead2739e0cdfa0/687474703a2f2f692e696d6775722e636f6d2f36665472645a612e676966)
