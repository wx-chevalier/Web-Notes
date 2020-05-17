# redux-form

## Simple Form

如果在 Redux Form 中需要手动地设置值，应该在 Field 的 `onChange` 方法中进行修改，譬如：

```jsx
<Select
  className="result_columns"
  placeholder="请选择关联列"
  multiple
  defaultValue={result_columns.value || []}
  onChange={(value) => {
    result_columns.onChange(value);
  }}
>
  <Option value="1">列1</Option>
  <Option value="2">列2</Option>
  <Option value="3">列3</Option>
</Select>
```

这一特性常常用于在自定义组件中进行值设置，

## Initial Form Values

```jsx
import { React, Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { reduxForm } from "redux-form";
import { registerPerson } from "actions/coolStuff";

@connect(null, (dispatch) => ({
  registerPerson: bindActionCreators(registerPerson, dispatch),
}))
export default class ExampleComponent extends Component {
  render() {
    const myInitialValues = {
      initialValues: {
        name: "John Doe",
        age: 42,
        fruitPreference: "apples",
      },
    };
    return (
      <div>
        <h1>Check out my cool form!</h1>
        <CoolForm
          {...myInitialValues}
          onSubmit={(fields) => {
            this.props.registerPerson(fields);
          }}
        />
      </div>
    );
  }
}

@reduxForm({
  form: "exampleForm",
  fields: ["name", "age", "fruitPreference"],
})
class CoolForm extends Component {
  render() {
    const {
      fields: { name, age, fruitPreference },
      handleSubmit,
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" {...name} />
        <label>Age</label>
        <input type="text" {...age} />
        <label>Do you prefer apples or oranges?</label>
        <select {...fruitPreference}>
          <option value="apples">Apples</option>
          <option value="oranges">Oranges</option>
        </select>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    );
  }
}
```
