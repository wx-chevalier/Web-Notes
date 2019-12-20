# Schema

在项目开发初期我们需要定义一个合适的 JSON Schema，所谓合适的 JSON Schema，就是指能满足现有的业务模型，尽量减少冗余的字段，又能支持一定的扩展。方便后续的维护更新扩展。一个 form 表单由 jsonSchema、uiSchema、formData、bizData 四个 json 来描述：

- jsonSchema 中描述了表单的数据类型、数据源、数据项等配置；

- uiSchema 描述了表单字段的渲染方法、渲染参数等；

- formData 描述了表单初始填充的各个字段的初始值；

- bizData 中是对表单字段的业务属性，注意的是，bizData 不会影响 Form 的渲染

# react-json-schema

react-jsonschema-form 是最初由 Firefox 开源的能够从 JSON Schema 中渲染出实际表单的 React 组件。

## JSONSchema

```json
{
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "required": ["firstName", "lastName"],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name"
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "age": {
      "type": "integer",
      "title": "Age"
    },
    "bio": {
      "type": "string",
      "title": "Bio"
    },
    "password": {
      "type": "string",
      "title": "Password",
      "minLength": 3
    },
    "telephone": {
      "type": "string",
      "title": "Telephone",
      "minLength": 10
    }
  }
}
```

## UISchema

```json
{
  "firstName": {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  "age": {
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:description": "(earthian year)"
  },
  "bio": {
    "ui:widget": "textarea"
  },
  "password": {
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!"
  },
  "date": {
    "ui:widget": "alt-datetime"
  },
  "telephone": {
    "ui:options": {
      "inputType": "tel"
    }
  }
}
```

## 合并的 Schema

```json
{
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "required": ["firstName", "lastName"],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name",
      "ui:autofocus": true,
      "ui:emptyValue": ""
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "age": {
      "type": "integer",
      "title": "Age",
      "ui:widget": "updown",
      "ui:title": "Age of person",
      "ui:description": "(earthian year)"
    },
    "bio": {
      "type": "string",
      "title": "Bio",
      "ui:widget": "textarea"
    },
    "password": {
      "type": "string",
      "title": "Password",
      "minLength": 3,
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!"
    },
    "telephone": {
      "type": "string",
      "title": "Telephone",
      "minLength": 10,
      "ui:options": {
        "inputType": "tel"
      }
    }
  }
}
```
