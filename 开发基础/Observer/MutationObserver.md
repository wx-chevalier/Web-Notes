# MutationObserver

MutationObserver 用于观察 DOM 元素的变化。可以观察到在父节点中添加或删除子节点、属性值或数据内容等变化。在 MutationObserver 之前，DOM 更改事件由 Mutation 事件处理，比如 DOMAttrModified、DOMAttributeNameChanged 和 DOMNodeInserted。MutationObserver 被 DOM3 中定义的 Mutation 事件所替代。避免这些突变事件的实际原因是性能问题和跨浏览器支持。

# 基础使用

## 创建观察者

它可以通过调用它的构造函数和传递处理函数和配置选项来创建。我们有一个选项来指定我们想要跟踪或观察什么样的变化。

```js
const config = { childList: true, attributes: true, characterData: true };

const observer = new MutationObserver(handler);
```

- childList: true，表示观察与子节点相关的变化
- attributes:true，表示观察属性更改
- characterData; true，表示观察目标元素的数据内容的变化

```js
{
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
}
```

## 定义要观察的目标对象

`observer.observe(...)` 方法接受应该被观察到的目标元素。

```js
const parent = document.querySelector(“.parent”);
observer.observe(parent, config);
```

## 定义回调事件

根据在观察者创建过程中使用的配置，当目标元素中发生更改时，会执行回调函数。回调函数是用突变记来对象触发的，该对象包含目标元素中发生的突变类型。

```js
function handler(mutationRecords, observer) {
  mutationRecords.forEach(mutationRecord => {
    switch (mutationRecord.type) {
      case 'childList':
        break;
      case 'attributes':
        break;
      default:
    }
  });
}
```

```js
/* Create mutation observer */
const config = {
  childList: true,
  attributes: true,
  characterData: true
};
const observer = new MutationObserver(handler);

/* Observe target */
const parent = document.querySelector('.parent');
observer.observe(parent, config);

/* Callback function when mutation happens */
function handler(mutationRecords, observer) {
  console.log('Handle mutation');
  mutationRecords.forEach(mutationRecord => {
    const info = document.querySelector('.infoBoard');
    switch (mutationRecord.type) {
      case 'childList':
        info.innerText =
          'Mutation Observer handler: Child node added or removed';

        break;
      case 'attributes':
        info.innerText = `Mutation Observer handler: Parent attribute modified: ${
          mutationRecord.attributeName
        } : ${mutationRecord.target.children.length}`;
        break;
      default:
        info.innerText = '';
    }
  });
}

/* Add child nodes when clicked on add child node button */
document.querySelector('.addBtn').addEventListener('click', () => {
  console.log('Add child');
  const child = document.createElement('div');
  child.className = 'child';
  child.innerText = 'Child ';
  parent.appendChild(child);
});

/* Remove child nodes when clicked on remove child node button */
document.querySelector('.removeBtn').addEventListener('click', () => {
  console.log('Remove child');
  const child = parent.firstChild;
  parent.removeChild(child);
});

/* Change attribute value when clicked on change attribute button */
document.querySelector('.changeAttrBtn').addEventListener('click', () => {
  console.log('Change attribute value');
  parent.setAttribute('data-count', parent.childNodes.length);
});
```
